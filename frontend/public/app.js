// Lightweight static React app for demo hosting (fallback without build step)

(function () {
  const { useEffect, useState } = React;

  // Try backend first, fall back to local demo data
  async function fetchRestaurants(search = '') {
    const url = `http://localhost:4000/api/restaurants?search=${encodeURIComponent(search)}`;
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch(url, { signal: ctrl.signal, mode: 'cors' });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Backend not available');
      const data = await res.json();
      return data.items || [];
    } catch {
      const res = await fetch('/demo/restaurants.json');
      const items = await res.json();
      return items.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
    }
  }

  function Navbar() {
    function toggleDark() {
      const html = document.documentElement;
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    }

    useEffect(() => {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') document.documentElement.classList.add('dark');
    }, []);

    return React.createElement(
      'nav',
      { className: 'navbar', 'aria-label': 'Main navigation' },
      React.createElement('div', { className: 'container', style: { display: 'flex', gap: '1rem', alignItems: 'center' } },
        React.createElement('a', { href: '/', className: 'brand', 'aria-label': 'Food Delivery Home' }, 'FoodApp'),
        React.createElement('div', { className: 'nav-actions', role: 'menubar', 'aria-label': 'Navigation menu' },
          React.createElement('a', { role: 'menuitem', href: '/' }, 'Home')
        ),
        React.createElement('div', { className: 'nav-actions', style: { marginLeft: 'auto' } },
          React.createElement('button', { className: 'btn', onClick: toggleDark, 'aria-label': 'Dark mode' }, '🌙 Dark mode')
        )
      )
    );
  }

  function SkeletonCard() {
    return React.createElement('div', { className: 'card', 'aria-busy': 'true', 'aria-label': 'Loading content' },
      React.createElement('div', { className: 'skeleton thumb' }),
      React.createElement('div', { className: 'content' },
        React.createElement('div', { className: 'skeleton line', style: { width: '60%', marginBottom: 8 } }),
        React.createElement('div', { className: 'skeleton line', style: { width: '90%', marginBottom: 8 } }),
        React.createElement('div', { className: 'skeleton line', style: { width: '40%', marginBottom: 8 } })
      )
    );
  }

  function RestaurantCard({ restaurant }) {
    return React.createElement('div', { className: 'card', style: { textAlign: 'left' }, role: 'listitem' },
      React.createElement('img', { src: restaurant.imageUrl, alt: restaurant.name, loading: 'lazy' }),
      React.createElement('div', { className: 'content' },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
          React.createElement('strong', null, restaurant.name),
          React.createElement('span', { 'aria-label': `${restaurant.rating} stars` }, `⭐ ${Number(restaurant.rating || 0).toFixed(1)}`)
        ),
        React.createElement('p', { style: { margin: '.4rem 0', color: '#666' } }, restaurant.description),
        React.createElement('span', { className: 'btn secondary', style: { marginTop: '.5rem' } }, `$${Number(restaurant.deliveryFee || 0).toFixed(2)} delivery`)
      )
    );
  }

  function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
      let mounted = true;
      setLoading(true);
      fetchRestaurants(search)
        .then((items) => mounted && setRestaurants(items))
        .finally(() => mounted && setLoading(false));
      return () => { mounted = false; };
    }, [search]);

    return React.createElement(React.Fragment, null,
      React.createElement('section', { className: 'hero', 'aria-label': 'Intro' },
        React.createElement('div', { className: 'container' },
          React.createElement('h1', null, 'Discover restaurants near you'),
          React.createElement('p', null, 'Order from top-rated places with fast delivery')
        )
      ),
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'form-row' },
          React.createElement('label', { htmlFor: 'search', className: 'sr-only' }, 'Search'),
          React.createElement('input', {
            id: 'search',
            type: 'search',
            placeholder: 'Search restaurants...',
            'aria-label': 'Search restaurants',
            value: search,
            onChange: (e) => setSearch(e.target.value)
          })
        ),
        React.createElement('div', { className: 'grid', role: 'list' },
          loading
            ? Array.from({ length: 8 }).map((_, i) => React.createElement(SkeletonCard, { key: i }))
            : restaurants.map((r) => React.createElement(RestaurantCard, { key: r.id || r.name, restaurant: r }))
        )
      )
    );
  }

  function Footer() {
    return React.createElement('footer', { role: 'contentinfo' },
      React.createElement('div', { className: 'container' }, `© ${new Date().getFullYear()} FoodApp — Demo static build`)
    );
  }

  function App() {
    return React.createElement(React.Fragment, null,
      React.createElement(Navbar, null),
      React.createElement(Home, null),
      React.createElement(Footer, null)
    );
  }

  // Register SW for PWA offline support (static only)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    });
  }

  const rootEl = document.getElementById('root');
  const root = ReactDOM.createRoot(rootEl);
  root.render(React.createElement(App));
})();