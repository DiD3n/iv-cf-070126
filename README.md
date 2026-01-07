# IVCF070126
Live coding (task description wasn’t attached as requested)

## Setup
- `npm i`
- `cp .env.template .env` (for local development)
- `docker compose up -d`
- `npm run start:dev`


## Post Note (PL) 
Aplikacja finalnie nie spełnia wymogów zadania. Największym problemem, jaki napotkałem, było błędne, początkowe przeanalizowanie formatu danych przychodzących z giełdy Binance. Pod koniec, kiedy nie miałem już dodatkowego czasu i chciałem przygotować analizę w formie wizualnej, zauważyłem potrzebę dodatkowego przetwarzania danych.

To z kolei wymagałoby przygotowania odpowiedniego mechanizmu agregacji - dla linii czasowej. Niestety mój brak znajomości nomenklatury giełdowej - który później nadrobię - nie pozwolił mi tego zrobić bez konsultacji w wyznaczonym czasie. Stąd w ostatnim commicie usunięcie wykresu: choć teoretycznie użyteczny, bez kontekstu innych analiz mógłby wprowadzać w błąd.