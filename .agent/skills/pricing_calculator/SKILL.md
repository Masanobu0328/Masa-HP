---
name: Pricing Calculator
description: Build a dynamic pricing calculator that estimates cleaning costs based on user inputs (rooms, bathrooms, service type) and passes the data to a contact form.
---

# Pricing Calculator Skill

This skill provides a reusable component for dynamically calculating service estimates. It reduces friction for potential customers by giving them immediate feedback on expected costs, filtering out window-shoppers, and qualifying leads before they use the contact form.

## Core Principles
1. **Interactive Form Elements**: Use modern, stylized radio buttons, checkboxes, and range sliders or number inputs.
2. **Real-time Feedback**: The estimated total must update instantly as the user changes options.
3. **Seamless Handoff**: Once the estimate is calculated, a "Get Final Quote / Book Now" button should smoothly transition the user to a contact form, passing along the selected options.
4. **Vanilla Tech**: Built using plain HTML, CSS, and JavaScript.

## Implementation Guide

### 1. HTML Structure

```html
<section class="pricing-calculator" id="calculator">
  <div class="calculator-container">
    <h2>Get an Instant Estimate</h2>
    <p>Select your requirements to see an estimated price.</p>
    
    <div class="calculator-grid">
      <!-- Options Configuration -->
      <div class="calc-options">
        
        <!-- Cleaning Type -->
        <div class="calc-group">
          <h3>1. Type of Cleaning</h3>
          <div class="radio-group">
            <label class="radio-card">
              <input type="radio" name="service-type" value="standard" data-price="100" checked>
              <div class="card-content">
                <span class="title">Standard Clean</span>
                <span class="desc">Regular maintenance</span>
              </div>
            </label>
            <label class="radio-card">
              <input type="radio" name="service-type" value="deep" data-price="150">
              <div class="card-content">
                <span class="title">Deep Clean</span>
                <span class="desc">Thorough scrub down</span>
              </div>
            </label>
            <label class="radio-card">
              <input type="radio" name="service-type" value="bond" data-price="300">
              <div class="card-content">
                <span class="title">Bond/End of Lease</span>
                <span class="desc">100% Bond Back Guarantee</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Room Inputs -->
        <div class="calc-group">
          <h3>2. Property Size</h3>
          <div class="counter-group">
            <label>Bedrooms ($30/each)</label>
            <div class="number-input">
              <button type="button" class="btn-minus" data-target="bedrooms">-</button>
              <input type="number" id="bedrooms" min="1" max="10" value="1" readonly>
              <button type="button" class="btn-plus" data-target="bedrooms">+</button>
            </div>
          </div>
          <div class="counter-group">
            <label>Bathrooms ($50/each)</label>
            <div class="number-input">
              <button type="button" class="btn-minus" data-target="bathrooms">-</button>
              <input type="number" id="bathrooms" min="1" max="10" value="1" readonly>
              <button type="button" class="btn-plus" data-target="bathrooms">+</button>
            </div>
          </div>
        </div>

        <!-- Extras -->
        <div class="calc-group">
          <h3>3. Extras</h3>
          <div class="checkbox-group">
            <label class="checkbox-lbl">
              <input type="checkbox" class="extra-service" data-price="40" value="Oven">
              <span class="check-text">Oven Cleaning ($40)</span>
            </label>
            <label class="checkbox-lbl">
              <input type="checkbox" class="extra-service" data-price="30" value="Fridge">
              <span class="check-text">Inside Fridge ($30)</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Result Panel -->
      <div class="calc-result">
        <div class="sticky-panel">
          <h3>Estimated Total</h3>
          <div class="price-display">
            <span class="currency">$</span>
            <span id="total-price">180</span>
          </div>
          <p class="disclaimer">*This is an estimate. Final price may vary.</p>
          <button id="proceed-to-contact" class="btn-primary" onclick="proceedToContact()">Get Detailed Quote</button>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 2. JavaScript Logic

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const serviceTypes = document.querySelectorAll('input[name="service-type"]');
  const minusBtns = document.querySelectorAll('.btn-minus');
  const plusBtns = document.querySelectorAll('.btn-plus');
  const extras = document.querySelectorAll('.extra-service');
  const priceDisplay = document.getElementById('total-price');

  // Rates
  const BEDROOM_RATE = 30;
  const BATHROOM_RATE = 50;

  // Render logic
  function calculateTotal() {
    let total = 0;

    // 1. Base Service Type
    const selectedService = document.querySelector('input[name="service-type"]:checked');
    if (selectedService) {
      total += parseInt(selectedService.getAttribute('data-price') || 0);
    }

    // 2. Property Size
    const beds = parseInt(document.getElementById('bedrooms').value);
    const baths = parseInt(document.getElementById('bathrooms').value);
    total += (beds * BEDROOM_RATE);
    total += (baths * BATHROOM_RATE);

    // 3. Extras
    extras.forEach(extra => {
      if (extra.checked) {
        total += parseInt(extra.getAttribute('data-price') || 0);
      }
    });

    // Update Display
    priceDisplay.textContent = total;
  }

  // Event Listeners for +/- buttons
  minusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      let val = parseInt(input.value);
      if (val > parseInt(input.min)) {
        input.value = val - 1;
        calculateTotal();
      }
    });
  });

  plusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      let val = parseInt(input.value);
      if (val < parseInt(input.max)) {
        input.value = val + 1;
        calculateTotal();
      }
    });
  });

  // Event Listeners for Radio/Checkboxes
  serviceTypes.forEach(radio => radio.addEventListener('change', calculateTotal));
  extras.forEach(checkbox => checkbox.addEventListener('change', calculateTotal));

  // Initial Calculation
  calculateTotal();
});

// Handoff to Contact Form
function proceedToContact() {
  const service = document.querySelector('input[name="service-type"]:checked').nextElementSibling.querySelector('.title').textContent;
  const beds = document.getElementById('bedrooms').value;
  const baths = document.getElementById('bathrooms').value;
  const total = document.getElementById('total-price').textContent;
  
  const extrasArray = [];
  document.querySelectorAll('.extra-service:checked').forEach(el => {
    extrasArray.push(el.value);
  });
  const extrasStr = extrasArray.join(', ');

  const message = `I would like a detailed quote.\n\nEstimate Details:\nService: ${service}\nSize: ${beds} Bed, ${baths} Bath\nExtras: ${extrasStr || 'None'}\nEstimated Price: $${total}`;
  
  // Populate the message field of your contact form
  const contactMessageField = document.getElementById('contact-message');
  if (contactMessageField) {
    contactMessageField.value = message;
    // Scroll to contact form
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }
}
```

## Styling Notes
- Use `display: grid` or `flex` for the layout. On mobile, stack them vertically. On desktop, the result panel (`.calc-result`) should be `position: sticky` so it stays in view while the user scrolls through long options.
- The default radio button UI is ugly. Use `input[type="radio"] { opacity: 0; position: absolute; }` and style the `.card-content` instead, changing its border when the radio is `:checked`.
