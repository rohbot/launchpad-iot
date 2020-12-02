#%%
import requests
import redis
r = redis.Redis()
URL = 'http://reg.bom.gov.au/fwo/IDV60901/IDV60901.95936.json'

res = requests.get(URL)
obs = res.json()['observations']
reading = obs['data'][0]
# %%
wind_dir = str(reading['wind_dir'])
wind_speed = reading['wind_spd_kmh']
print(wind_dir, wind_speed)
# %%
r.publish('wind_dir', wind_dir)
r.publish('wind_speed', wind_speed)
