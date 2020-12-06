#%%
from random import random
import time
#%%
ROWS = 8
COLS = 8

# %%
def get_neighbours(x,y):
  neighours = 0
  if x - 1 >= 0 and y - 1 >= 0 and x - 1 < ROWS and y - 1 < COLS:
    if grid[x-1][y-1]:
      neighours += 1
  if x >= 0 and y - 1 >= 0 and x < ROWS and y - 1 < COLS:
    if grid[x][y-1]:
      neighours += 1
  if x + 1 >= 0 and y - 1 >= 0 and x + 1 < ROWS and y - 1 < COLS:
    if grid[x+1][y-1]:
      neighours += 1

  if x - 1 >= 0 and y >= 0 and x - 1 < ROWS and y < COLS:
    if grid[x-1][y]:
      neighours += 1
  if x + 1 >= 0 and y >= 0 and x  + 1 < ROWS and y < COLS:
    if grid[x+1][y]:
      neighours += 1

  if x - 1 >= 0 and y + 1 >= 0 and x - 1 < ROWS and y + 1 < COLS:
    if grid[x-1][y+1]:
      neighours += 1
  if x >= 0 and y + 1 >= 0 and x < ROWS and y + 1 < COLS:
    if grid[x][y+1]:
      neighours += 1
  if x + 1 >= 0 and y + 1 >= 0 and x + 1 < ROWS and y + 1 < COLS:
    if grid[x+1][y+1]:
      neighours += 1
  return neighours
# %%
def refresh_grid():
  grid = []
  for _ in range(COLS):
    row = []
    for _ in range(ROWS):
      if random() < 0.3:
        row.append(1)
      else:
        row.append(0)
    grid.append(row)
  return grid

def grid_alive(grid):
  for x in range(COLS):
    row = []
    for y in range(ROWS):
      if grid[x][y]:
        return True
  return False

def display_grid(grid):
  print("-----------")
  for x in range(ROWS):
     print(grid[x])
  print("-----------")
count = 0
grid = refresh_grid()
while count < 10 and grid_alive(grid):
  new_grid = []
  for x in range(COLS):
    row = []
    for y in range(ROWS):
      neighbours = get_neighbours(x,y)
      cell = 0
      if neighbours < 2: 
        cell = 0 # cell dies
      elif neighbours in [2,3]:
        cell = grid[x][y]  # survives if alvie
      elif neighbours == 3 and not grid[x][y]:
        cell = 1 # rebirth if 3 neighbouts
      elif neighbours > 3:
        cell = 0
      row.append(cell)
    new_grid.append(row)
  grid = new_grid
  display_grid(grid)
  count += 1
  time.sleep(0.5)

# %%
