# PAyment details
We are using stripe to process cards. In theory we could process real cards but stick to these test cards 

| Card Number |	Brand |	CVC |	Date |	Behavior |
|-------------|-------|-----|--------|-----------|
|4242 4242 4242 4242 |	Visa | Any 3 digits | Any future date |Successful payment|
|4000 0025 0000 3155 |	Visa | Any 3 digits | Any future date | Requires authentication|
|5555 5555 5555 4444 |	Mastercard | Any 3 digits | Any future date	| Successful payment|
|2223 0031 2200 3222 |	Mastercard | Any 3 digits | Any future date | Successful payment (2-series)|
|3782 822463 10005	| Amex | Any 4 digits |	Any future date	| Successful payment|
|6011 1111 1111 1117 | Discover | Any 3 digits | Any future date | Successful payment|
|3056 9309 0259 04 | Diners Club | Any 3 digits | Any future date | Successful payment|

You will need to provide an email address and physical address. Ive been testing with the admin user so I used admin@admin.com and 0 Admin St 

Absolutely no thought has been put into styling. I know we are using scss so i made some just to get something on the screen. Feel free to totally change everything about how it looks because its BAD right now. 

Make sure you have
VITE_STRIPE_PUBLISHABLE_KEY=PK_YOUR_KEY_HERE
in your .env

