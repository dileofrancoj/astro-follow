import sys
from skyfield.api import load, Topos
from astropy.time import Time
from astropy.coordinates import EarthLocation
from datetime import datetime

def get_planet(name, planets):
    try:
        return planets[name]
    except:
        return None

# ========== 1. Coordenadas RA / DEC ==========
planets = load('de421.bsp')
earth = planets['earth']

# Pasar lat/lon desde línea de comandos
target_name = sys.argv[1]
lat = float(sys.argv[2])
lon = float(sys.argv[3])

t = load.timescale().now()
observer = earth + Topos(latitude_degrees=lat, longitude_degrees=lon)

# Obtener planeta u objeto
target = get_planet(target_name, planets)
if target is None:
    print("error")
    sys.exit(1)

astrometric = observer.at(t).observe(target)
ra, dec, _ = astrometric.radec()

# ========== 2. Calcular GST / LST ==========
astropy_time = Time(datetime.utcnow())
location = EarthLocation(lat=lat, lon=lon)

gst = astropy_time.sidereal_time('mean', 'greenwich').hour  # en horas
lst = astropy_time.sidereal_time('mean', location).hour     # en horas


# ========== 4. Devolver resultado ==========
print(f"{ra.hours};{dec.degrees};{gst};{lst}")
