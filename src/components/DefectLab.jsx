import React from 'react';

function FormsLab({ fixed }) {
  return (
    <section className="lab-sample" aria-labelledby="sample-form-title">
      <p className="eyebrow">Scenario 01 · Forms</p>
      <h3 id="sample-form-title">Account contact form</h3>
      <p className="muted">Compare the label and error handling in the selected mode.</p>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          {fixed && <label htmlFor="lab-email">Email address</label>}
          <input id="lab-email" type="email" placeholder="Enter your email" aria-describedby={fixed ? 'lab-email-hint' : undefined} />
          {fixed && <small id="lab-email-hint">We will only use this for account updates.</small>}
        </div>
        <div className="field">
          <label htmlFor="lab-name">Full name <span aria-hidden="true">*</span></label>
          <input id="lab-name" required aria-required={fixed ? 'true' : undefined} />
        </div>
        <button type="submit">Save contact</button>
      </form>
      {!fixed && <p className="issue-note">Seeded defect: the email field has no associated visible label.</p>}
      {fixed && <p className="success-note">Corrected example: both fields have labels and the email field has supporting text.</p>}
    </section>
  );
}

function KeyboardLab({ fixed }) {
  return (
    <section className="lab-sample" aria-labelledby="sample-keyboard-title">
      <p className="eyebrow">Scenario 02 · Keyboard</p>
      <h3 id="sample-keyboard-title">Action controls</h3>
      <p className="muted">Use Tab and Shift+Tab to inspect focus visibility.</p>
      <div className="sample-actions">
        {fixed ? (
          <>
            <button type="button">Open details</button>
            <a href="#keyboard-guidance">Read keyboard guidance</a>
          </>
        ) : (
          <>
            <div className="fake-button" onClick={() => {}}>Open details</div>
            <a className="low-focus-link" href="#keyboard-guidance">Read keyboard guidance</a>
          </>
        )}
      </div>
      <p id="keyboard-guidance" className="muted">Keyboard test target: confirm that focus is visible and the controls are operable.</p>
      {!fixed && <p className="issue-note">Seeded defect: a clickable div is not a native keyboard-operable button.</p>}
      {fixed && <p className="success-note">Corrected example: native button and link semantics are used.</p>}
    </section>
  );
}

function ImagesLinksLab({ fixed }) {
  return (
    <section className="lab-sample" aria-labelledby="sample-images-title">
      <p className="eyebrow">Scenario 03 · Images & links</p>
      <h3 id="sample-images-title">Product information</h3>
      <div className="placeholder-image" role={fixed ? undefined : 'img'} aria-label={fixed ? undefined : undefined}>
        <span aria-hidden="true">AL</span>
      </div>
      {fixed && <p className="muted">Illustration of the AccessLens product mark.</p>}
      <p>Explore the product overview and learn how the audit workflow works.</p>
      <a href="#product-details">{fixed ? 'Read the product overview' : 'Click here'}</a>
      <div id="product-details" className="subtle-box">Product overview content.</div>
      {!fixed && <p className="issue-note">Seeded defect: the link text does not describe its destination.</p>}
      {fixed && <p className="success-note">Corrected example: link text communicates its purpose.</p>}
    </section>
  );
}

function DialogLab({ fixed }) {
  const [open, setOpen] = React.useState(false);
  const dialogRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  React.useEffect(() => {
    if (open && fixed) dialogRef.current?.focus();
  }, [open, fixed]);

  function closeDialog() {
    setOpen(false);
    if (fixed) triggerRef.current?.focus();
  }

  return (
    <section className="lab-sample" aria-labelledby="sample-dialog-title">
      <p className="eyebrow">Scenario 04 · Dialogs</p>
      <h3 id="sample-dialog-title">Review details dialog</h3>
      <p className="muted">Open the dialog, inspect its accessible name and focus behavior, then close it.</p>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>Open review dialog</button>
      {open && (
        <div className="dialog-backdrop">
          <div
            ref={dialogRef}
            className="dialog-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={fixed ? 'review-dialog-title' : undefined}
            tabIndex={fixed ? -1 : undefined}
          >
            {fixed && <h4 id="review-dialog-title">Review audit findings</h4>}
            {!fixed && <h4>Review audit findings</h4>}
            <p>This dialog is included to support manual focus and accessible-name testing.</p>
            <button type="button" onClick={closeDialog}>Close dialog</button>
          </div>
        </div>
      )}
      {!fixed && <p className="issue-note">Seeded defect: the dialog has no programmatic accessible name.</p>}
      {fixed && <p className="success-note">Corrected example: dialog is named and focus is returned to its trigger.</p>}
    </section>
  );
}

function DynamicLab({ fixed }) {
  const [saved, setSaved] = React.useState(false);
  return (
    <section className="lab-sample" aria-labelledby="sample-dynamic-title">
      <p className="eyebrow">Scenario 05 · Dynamic content</p>
      <h3 id="sample-dynamic-title">Save settings</h3>
      <p className="muted">Trigger an update and inspect how the result is exposed.</p>
      <button type="button" onClick={() => setSaved(true)}>Save settings</button>
      {saved && <p className={fixed ? 'success-note' : 'issue-note'} role={fixed ? 'status' : undefined}>Settings saved successfully.</p>}
      {!fixed && <p className="issue-note">Seeded defect: the update message is not marked as a status message.</p>}
      {fixed && <p className="success-note">Corrected example: the update is exposed through a status role.</p>}
    </section>
  );
}

function ResponsiveLab({ fixed }) {
  return (
    <section className="lab-sample" aria-labelledby="sample-responsive-title">
      <p className="eyebrow">Scenario 06 · Responsive & zoom</p>
      <h3 id="sample-responsive-title">Responsive information card</h3>
      <p className="muted">Resize the viewport and zoom the browser to inspect reflow.</p>
      <div className={fixed ? 'responsive-demo' : 'responsive-demo broken'}>
        <div><strong>Audit summary</strong><p>Review detected issues and planned fixes.</p></div>
        <div><strong>Next action</strong><p>Retest corrected components.</p></div>
      </div>
      {!fixed && <p className="issue-note">Seeded defect: the sample card intentionally uses a fixed-width layout.</p>}
      {fixed && <p className="success-note">Corrected example: the card adapts to narrower layouts.</p>}
    </section>
  );
}

const labs = {
  Forms: FormsLab,
  Keyboard: KeyboardLab,
  'Images & links': ImagesLinksLab,
  'Dialogs & menus': DialogLab,
  'Dynamic content': DynamicLab,
  'Responsive & zoom': ResponsiveLab
};

export default function DefectLab({ category, fixed }) {
  const Lab = labs[category] || FormsLab;
  return <Lab fixed={fixed} />;
}
