# Template Variables Guide

This guide details the variables available for use in HTML templates (e.g., `invoice.html`, `quote.html`). These variables are passed to the template engine (Handlebars) when generating PDFs.

## Common Root Variables (Invoice & Quote)

These variables are available at the root level of your template.

| Variable | Type | Description |
| :--- | :--- | :--- |
| `number` | String | The unique document number (e.g., "INV-001"). |
| `date` | String | Creation date, formatted as a local date string. |
| `dueDate` | String | Due/Expiration date, formatted as a local date string (or null). |
| `status` | String | Current status (e.g., "DRAFT", "SENT", "PAID"). |
| `total` | String | Total amount, formatted with 2 decimal places. **For Balance Invoices, this is the Net Payable Amount (Gross - Retainer).** |
| `currency` | String | Currency code (e.g., "EUR"). |
| `notes` | String | Optional notes/comments added to the document. |
| `client` | Object | The client details object (see below). |
| `items` | Array | List of items/products (see below). |

## Invoice-Specific Variables

These variables are only available when generating an Invoice PDF.

### General
| Variable | Type | Description |
| :--- | :--- | :--- |
| `isRecurring` | Boolean | True if this is a recurring invoice. |
| `recurringInterval`| String | Interval for recurring invoices (e.g., "MONTHLY") if applicable. |
| `quote` | Object | The original Quote object (if linked). Accessible via `{{quote.number}}` etc. |

### Retainer Invoices
These variables are populated if the invoice is a **Retainer Invoice** (`isRetainer` is true).

| Variable | Type | Description |
| :--- | :--- | :--- |
| `isRetainer` | Boolean | True if this is a retainer invoice. |
| `retainerPercentage`| Number | The percentage value of the retainer (e.g., 50). |

### Balance Invoices
These variables are populated if the invoice is a **Balance Invoice** (`isBalance` is true).

| Variable | Type | Description |
| :--- | :--- | :--- |
| `isBalance` | Boolean | True if this is a balance invoice. |
| `retainerDeductionAmount` | Number | The amount deducted from the total (the paid retainer amount). |
| `retainerInvoiceId` | String | The ID of the linked retainer invoice. |
| `retainerInvoice` | Object | The linked Retainer Invoice object. Accessible via `{{retainerInvoice.number}}`. |

## Client Object (`client`)

Access these properties via `client.propertyName` (e.g., `{{client.name}}`).

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Client's name or company name. |
| `email` | String | Contact email address. |
| `address` | String | Street address. |
| `city` | String | City. |
| `zipCode` | String | Postal/Zip code. |
| `country` | String | Country name. |
| `phone` | String | Phone number. |
| `vatNumber` | String | VAT identification number. |
| `companyId` | String | Company registration ID (SIRET/SIREN). |

## Item Object (`items`)

Iterate over the items array using `{{#each items}} ... {{/each}}`.

| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Short title of the item (optional). |
| `description` | String | Detailed description of the item. |
| `quantity` | Number | Quantity of the item. |
| `price` | String | Unit price, formatted with 2 decimal places. |
| `total` | String | Line total (Quantity * Price), formatted with 2 decimal places. |
| `vat` | Number | VAT percentage applicable to this item. |
