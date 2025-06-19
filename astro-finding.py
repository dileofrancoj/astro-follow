import sys
from skyfield.api import load, Topos
from astropy.time import Time
from astropy.coordinates import EarthLocation
from datetime import datetime # No necesitamos 'time' si creamos datetime directamente

def get_planet(name, planets):
    try:
        return planets[name]
    except:
        return None

# ========== 1. Parámetros de entrada ==========
# sys.argv ahora esperará: [script_name, target_name, lat, lon, year_utc, month_utc, day_utc, hour_utc, minute_utc, second_utc]
# Es decir, 10 argumentos en total, incluyendo el nombre del script (sys.argv[0])
if len(sys.argv) < 10:
    print("Usage: python astro-finding.py <target_name> <lat> <lon> <year_utc> <month_utc> <day_utc> <hour_utc> <minute_utc> <second_utc>")
    sys.exit(1)

target_name = sys.argv[1]
lat = float(sys.argv[2])
lon = float(sys.argv[3])
year_param = int(sys.argv[4])    # Nuevo: año
month_param = int(sys.argv[5])   # Nuevo: mes
day_param = int(sys.argv[6])     # Nuevo: día
hour_param = int(sys.argv[7])
minute_param = int(sys.argv[8])
second_param = int(sys.argv[9])

# ========== 2. Crear objetos de tiempo usando la FECHA Y HORA COMPLETAS RECIBIDAS (UTC) ==========
# Ahora creamos el objeto datetime directamente con todos los parámetros
target_datetime_utc = datetime(year_param, month_param, day_param,
                               hour_param, minute_param, second_param)

# Objeto de tiempo de Skyfield
t = load.timescale().utc(
    target_datetime_utc.year,
    target_datetime_utc.month,
    target_datetime_utc.day,
    target_datetime_utc.hour,
    target_datetime_utc.minute,
    target_datetime_utc.second
)

# Objeto de tiempo de Astropy
astropy_time = Time(target_datetime_utc)

planets = load('de421.bsp')
earth = planets['earth']
observer = earth + Topos(latitude_degrees=lat, longitude_degrees=lon)

# Obtener planeta u objeto
target = get_planet(target_name, planets)
if target is None:
    print("error")
    sys.exit(1)

astrometric = observer.at(t).observe(target)
ra, dec, _ = astrometric.radec()

# ========== 3. Calcular GST / LST para la fecha/hora UTC completa ==========
location = EarthLocation(lat=lat, lon=lon)

gst = astropy_time.sidereal_time('mean', 'greenwich').hour
lst = astropy_time.sidereal_time('mean', location).hour

# ========== 4. Devolver resultado ==========
print(f"{ra.hours};{dec.degrees};{gst};{lst}")