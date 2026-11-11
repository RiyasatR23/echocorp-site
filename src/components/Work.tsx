import { Logo } from './Logo';

const PROJECTS = ['Pro Level Coaching', 'Domus Davidis', 'Domus Luxus'];

export default function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <span className="eyebrow">Selected work</span>
          <h2 id="work-title">Live sites for real businesses.</h2>
        </div>
        <ul className="work-grid">
          {PROJECTS.map((project) => (
            <li className="work-card reveal" key={project}>
              <span className="work-mark">
                <Logo variant="mark" />
              </span>
              <div>
                <p className="work-status mono">Live</p>
                <h3>{project}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
