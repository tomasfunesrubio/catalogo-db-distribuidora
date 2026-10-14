import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
EXCEL_PATH = os.path.join(PROJECT_ROOT, 'CATALOGO 10 OCTUBRE.xlsx')
OUTPUT_JSON = os.path.join(PROJECT_ROOT, 'data', 'catalog.json')
OUTPUT_TS = os.path.join(PROJECT_ROOT, 'data', 'products.ts')

def parse_price(val_str):
    if not val_str:
        return 0
    clean = re.sub(r'[^\d.]', '', val_str.replace(',', '').replace('$', ''))
    try:
        return float(clean)
    except:
        return 0

CATEGORY_MAP = {
    'VINO TINTO': 'Vinos y Espumantes',
    'VINO BLANCO': 'Vinos y Espumantes',
    'CHAMPAGNE/ESPUMANTE': 'Vinos y Espumantes',
    'SIDRA': 'Vinos y Espumantes',
    'VINO TINTO BOTELLON': 'Vinos y Espumantes',
    'VINO': 'Vinos y Espumantes',
    'VINO TETRA': 'Vinos y Espumantes',
    'VARIETAL': 'Vinos y Espumantes',
    'VINOS': 'Vinos y Espumantes',
    'VINO ESPUMANTE': 'Vinos y Espumantes',
    
    'CERVEZA': 'Cervezas',
    'CERVEZA LATA': 'Cervezas',
    'CERVEZA X LT': 'Cervezas',
    'CERVEZA LATON': 'Cervezas',
    'CERVEZA SIN ALCOHOL': 'Cervezas',
    'CERVEZA PORRON': 'Cervezas',
    'CERVEZA 710': 'Cervezas',
    'CERVAZA': 'Cervezas',
    
    'APERITIVO': 'Aperitivos y Destilados',
    'VODKA': 'Aperitivos y Destilados',
    'LICORES': 'Aperitivos y Destilados',
    'WHISKY': 'Aperitivos y Destilados',
    'PETACA': 'Aperitivos y Destilados',
    'GIN': 'Aperitivos y Destilados',
    'RON': 'Aperitivos y Destilados',
    'LICOR': 'Aperitivos y Destilados',
    'TEQUILA': 'Aperitivos y Destilados',
    'PULPA': 'Aperitivos y Destilados',
    
    'GASEOSAS': 'Gaseosas, Aguas y Jugos',
    'SABORIZADA': 'Gaseosas, Aguas y Jugos',
    'JUGO POLVO': 'Gaseosas, Aguas y Jugos',
    'JUGO TETRA': 'Gaseosas, Aguas y Jugos',
    'JUGO EN POLVO': 'Gaseosas, Aguas y Jugos',
    'AGUA': 'Gaseosas, Aguas y Jugos',
    'SODA': 'Gaseosas, Aguas y Jugos',
    'BEBIDA DEPORTIVA': 'Gaseosas, Aguas y Jugos',
    'ENERGIZANTE': 'Gaseosas, Aguas y Jugos',
    
    'PROMO': 'Promociones',
    'PROMOS': 'Promociones'
}

def extract_unit(name, dept):
    n_up = name.upper()
    d_up = dept.upper()
    
    m_pack = re.search(r'X\s*(\d+)\s*(?:UD|U)\b', n_up)
    if m_pack:
        return f'Pack x{m_pack.group(1)}'
    
    if 'X6 UD' in n_up or 'X6UD' in n_up:
        return 'Pack x6'
    if 'X12 UD' in n_up or 'X12UD' in n_up:
        return 'Pack x12'
    if 'X24 UD' in n_up or 'X24UD' in n_up:
        return 'Pack x24'
    if 'X10 UD' in n_up:
        return 'Pack x10'
    if 'X40 UD' in n_up:
        return 'Pack x40'
        
    if 'LATA' in d_up or 'LATON' in d_up:
        return 'Lata'
    if 'BOTELLON' in d_up or 'X LT' in d_up:
        return 'Botellón'
    if any(k in d_up for k in ['VINO', 'WHISKY', 'VODKA', 'GIN', 'APERITIVO', 'CHAMPAGNE', 'LICOR']):
        return 'Botella'
    if any(k in d_up for k in ['SNACKS', 'ALFAJOR', 'GALLETITAS']):
        return 'Paquete'
        
    return 'Unidad'

def extract_brand(name):
    # take leading brand if known, or first 1-2 words
    words = name.strip().split()
    if not words:
        return ''
    if len(words) >= 2 and words[0].upper() in ['LOS', 'LAS', 'SAN', 'SANTA', 'DE', 'DON', 'LA', 'EL']:
        return f'{words[0]} {words[1]}'.upper()
    return words[0].upper()

def main():
    if not os.path.exists(EXCEL_PATH):
        print(f'Error: Excel file not found at {EXCEL_PATH}')
        return

    with zipfile.ZipFile(EXCEL_PATH, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text = ''.join(t.text for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
                shared_strings.append(text)
        
        sheet_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows = sheet_tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
        
        all_data = []
        for r in rows:
            row_vals = []
            for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = v.text if v is not None else ''
                if c.get('t') == 's' and val.isdigit():
                    val = shared_strings[int(val)]
                row_vals.append(val)
            all_data.append(row_vals)

    products = []
    for i, r in enumerate(all_data[1:]):
        code = r[0].strip() if len(r) > 0 else str(i+1)
        name = r[1].strip() if len(r) > 1 else ''
        if not name:
            continue
        dept = r[5].strip() if len(r) > 5 else 'VARIOS'
        if dept == '- Sin Departamento -':
            dept = 'VARIOS'
        
        category = CATEGORY_MAP.get(dept, 'Kiosco y Almacén')
        
        p_costo = parse_price(r[2]) if len(r) > 2 else 0
        p_venta = parse_price(r[3]) if len(r) > 3 else 0
        p_mayoreo = parse_price(r[4]) if len(r) > 4 else 0
        
        if p_venta > 0:
            price = p_venta
            wholesale = p_mayoreo if p_mayoreo > 0 else None
        elif p_mayoreo > 0:
            price = p_mayoreo
            wholesale = None
        else:
            price = 0
            wholesale = None
            
        unit = extract_unit(name, dept)
        brand = extract_brand(name)
        
        is_promo = 'PROMO' in dept or 'PROMO' in name.upper()
        discount_text = None
        if wholesale and wholesale < price:
            diff_pct = round(((price - wholesale) / price) * 100)
            if diff_pct >= 5:
                discount_text = f'Mayoreo -{diff_pct}%'
        elif is_promo:
            discount_text = 'PROMO'

        products.append({
            'id': f'p-{code}',
            'code': code,
            'name': name,
            'brand': brand,
            'department': dept,
            'category': category,
            'price': price,
            'wholesalePrice': wholesale,
            'unit': unit,
            'discount': discount_text,
            'featured': is_promo or (wholesale is not None and wholesale < price * 0.9)
        })

    # Save to catalog.json
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    categories_list = [
        'Vinos y Espumantes',
        'Cervezas',
        'Aperitivos y Destilados',
        'Gaseosas, Aguas y Jugos',
        'Kiosco y Almacén',
        'Promociones'
    ]

    # Generate TypeScript file
    ts_code = f"""// Archivo generado automáticamente desde CATALOGO 10 OCTUBRE.xlsx
import catalogData from './catalog.json'

export type Product = {{
  id: string
  code: string
  name: string
  brand: string
  department: string
  category: string
  price: number
  wholesalePrice?: number | null
  unit: string
  discount?: string | null
  featured?: boolean
}}

export const products: Product[] = catalogData as Product[]

export function getProducts(): Product[] {{
  return products
}}

export const categories = {json.dumps(categories_list, ensure_ascii=False)} as const

export const formatPrice = (value: number) => {{
  if (!value || value <= 0) return 'Consultar'
  return new Intl.NumberFormat('es-AR', {{
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }}).format(value)
}}
"""
    with open(OUTPUT_TS, 'w', encoding='utf-8') as f:
        f.write(ts_code)

    print(f'Successfully imported {len(products)} products from {EXCEL_PATH} into {OUTPUT_JSON} and {OUTPUT_TS}')

if __name__ == '__main__':
    main()
