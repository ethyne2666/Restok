import { Activity, Cross, Heart, Package, Pill, Stethoscope, Syringe, Tablets, Thermometer, Boxes, ClipboardList, FlaskConical } from 'lucide-react';

const ICONS = [Pill, Cross, Syringe, Tablets, Stethoscope, Heart, Package, Thermometer, Boxes, Activity, ClipboardList, FlaskConical];

// [top %, left %, size px, delay s, icon index]
const SPOTS = [
  [6, 4, 16, 0, 0], [12, 22, 12, 1.2, 1], [8, 41, 14, 0.6, 2], [5, 63, 12, 2, 3], [14, 82, 16, 0.3, 4], [9, 94, 12, 1.6, 5],
  [28, 8, 12, 1, 6], [34, 30, 14, 2.2, 7], [30, 55, 12, 0.4, 8], [27, 74, 14, 1.4, 9], [38, 92, 12, 0.8, 10],
  [52, 3, 14, 1.8, 11], [58, 18, 12, 0.2, 1], [50, 46, 12, 2.4, 2], [56, 68, 16, 1.1, 3], [60, 88, 12, 0.7, 0],
  [74, 10, 12, 1.5, 4], [80, 27, 14, 0.9, 5], [72, 50, 12, 2.1, 6], [78, 71, 12, 0.5, 7], [84, 93, 14, 1.3, 8],
  [93, 6, 14, 1.9, 9], [91, 36, 12, 0.1, 10], [94, 60, 14, 1.7, 11], [90, 80, 12, 2.3, 0],
];

export function FloatingIcons({ className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {SPOTS.map(([top, left, size, delay, i], idx) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <span key={idx}
            className="rs-float pointer-events-auto absolute text-green-600/30 transition-all duration-300 hover:scale-150 hover:text-green-600/80"
            style={{ top: `${top}%`, left: `${left}%`, animationDelay: `${delay}s` }}>
            <Icon size={size} strokeWidth={1.6} />
          </span>
        );
      })}
    </div>
  );
}