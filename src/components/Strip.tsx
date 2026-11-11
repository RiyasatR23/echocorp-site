const AUDIENCES = ['Trades & services', 'Clinics & salons', 'Academies & schools', 'Shops & e-commerce', 'Property & renovation'];

export default function Strip() {
  return (
    <section className="strip section-surface" aria-label="Who we build for">
      <div className="wrap strip-inner">
        <h2 className="strip-title">Built for local businesses</h2>
        <ul className="tags">
          {AUDIENCES.map((audience) => (
            <li key={audience}>{audience}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
