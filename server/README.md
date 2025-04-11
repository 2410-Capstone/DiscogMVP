# 🛒 E-Commerce App - Database Schema

### Definitions
- `PK`: PRIMARY KEY  
- `FK`: FOREIGN KEY  
- `UUID`: Universally Unique Identifier  
- `SERIAL`: Auto-incrementing integer  
- `VARCHAR`: Variable-length character string (max length specified)  
- `NUMERIC(10, 2)`: Decimal number with up to 10 digits total and 2 after the decimal point  

---

## Tables & Relationships

### USERS 
> *Stores customer/admin info*

```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
email         VARCHAR(255) UNIQUE NOT NULL
password      VARCHAR(255) NOT NULL
name          VARCHAR(255) NOT NULL
address       VARCHAR(255)
user_role     role NOT NULL DEFAULT 'customer' -- ENUM: 'customer', 'admin'
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP DEFAULT NOW()
```

### PRODUCTS 
> *Items for sale*

```sql
id            SERIAL PRIMARY KEY
artist        VARCHAR(255) NOT NULL
description   TEXT
price         NUMERIC(10, 2) NOT NULL
image_url     VARCHAR(255)
genre         VARCHAR(255)
stock         INTEGER DEFAULT 0
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP DEFAULT NOW()
```

### CARTS
> *Active/checked-out carts per user*

```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID NOT NULL REFERENCES USERS(id) ON DELETE CASCADE
cart_status   c_status NOT NULL DEFAULT 'active' -- ENUM: 'active', 'checked_out'
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP DEFAULT NOW()

```

### CART_ITEMS
> *Product entries within carts*

```sql
id            SERIAL PRIMARY KEY
cart_id       UUID NOT NULL REFERENCES CARTS(id) ON DELETE CASCADE
product_id    INTEGER NOT NULL REFERENCES PRODUCTS(id) ON DELETE CASCADE
quantity      INTEGER NOT NULL CHECK (quantity > 0)

```

### ORDERS
> *Completed orders*

```sql
id               UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id          UUID NOT NULL REFERENCES USERS(id) ON DELETE CASCADE
order_status     o_status NOT NULL DEFAULT 'created' -- ENUM: 'created', 'processing', 'completed', 'cancelled'
total            NUMERIC(10, 2)
shipping_address TEXT
tracking_number  VARCHAR(255)
created_at       TIMESTAMP DEFAULT NOW()
updated_at       TIMESTAMP DEFAULT NOW()

```

### ORDER_ITEMS
> *Products purchased in orders*

```sql
id            SERIAL PRIMARY KEY
order_id      UUID NOT NULL REFERENCES ORDERS(id) ON DELETE CASCADE
product_id    INTEGER NOT NULL REFERENCES PRODUCTS(id) ON DELETE CASCADE
quantity      INTEGER NOT NULL
price         NUMERIC(10, 2) NOT NULL

```

### PAYMENTS 
> *Payment details for orders*


```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
order_id        UUID NOT NULL REFERENCES ORDERS(id) ON DELETE CASCADE
billing_name    VARCHAR
billing_address TEXT
payment_method  VARCHAR
payment_status  p_status DEFAULT 'pending' -- ENUM: 'pending', 'paid', 'failed'
payment_date    TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()

```

### ENUMS

```sql
CREATE TYPE role AS ENUM ('customer', 'admin');
CREATE TYPE c_status AS ENUM ('active', 'checked_out');
CREATE TYPE o_status AS ENUM ('created', 'processing', 'completed', 'cancelled');
CREATE TYPE p_status AS ENUM ('pending', 'paid', 'failed');

```


### INDEXES & CONSTRAINTS  
- Foreign Keys use `ON DELETE CASCADE` to maintain referential integrity.
- Indexing improves *look-up* performance on `FK` columns. 


```sql
CREATE INDEX idx_cart_user ON carts(user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_payment_order_id ON payments(order_id);
```

