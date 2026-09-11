import re

with open('server.ts', 'r') as f:
    content = f.read()

# I will replace the in-memory db with postgres code
# Instead of doing it line by line which is risky, I will replace the whole API Routes section.
# The user might be expecting a complete working file.

