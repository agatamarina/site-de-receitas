import { useState } from 'react';
import { categories, recipes, type Category, type Recipe } from './data/recipes';

type Page =
  | { name: 'home' }
  | { name: 'category'; category: Category }
  | { name: 'recipe'; recipeId: number }
  | { name: 'share' };

export default function App() {
  const [page, setPage] = useState<Page>({ name: 'home' });
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page.name === 'category') {
    const allRecipes = [...recipes, ...userRecipes];
    const filtered = allRecipes.filter(r => r.category === page.category);
    const cat = categories.find(c => c.id === page.category)!;
    return (
      <CategoryPage
        category={cat}
        recipes={filtered}
        onBack={() => navigate({ name: 'home' })}
        onRecipe={id => navigate({ name: 'recipe', recipeId: id })}
      />
    );
  }

  if (page.name === 'recipe') {
    const allRecipes = [...recipes, ...userRecipes];
    const recipe = allRecipes.find(r => r.id === page.recipeId)!;
    const cat = categories.find(c => c.id === recipe.category)!;
    return (
      <RecipePage
        recipe={recipe}
        onBack={() => navigate({ name: 'category', category: recipe.category })}
        onHome={() => navigate({ name: 'home' })}
        categoryLabel={cat.label}
      />
    );
  }

  if (page.name === 'share') {
    return (
      <SharePage
        onBack={() => navigate({ name: 'home' })}
        onSubmit={(r) => {
          setUserRecipes(prev => [...prev, { ...r, id: Date.now(), userSubmitted: true }]);
          navigate({ name: 'home' });
        }}
      />
    );
  }

  return (
    <HomePage
      onCategory={cat => navigate({ name: 'category', category: cat })}
      onShare={() => navigate({ name: 'share' })}
    />
  );
}

// ─── HOME ───────────────────────────────────────────────────────────────────

function HomePage({
  onCategory,
  onShare,
}: {
  onCategory: (c: Category) => void;
  onShare: () => void;
}) {
  return (
    <div className="min-h-screen" style={{ background: '#f9f4ed' }}>
      <Nav onShare={onShare} onHome={() => {}} isHome />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop&auto=format)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,24,16,0.82) 0%, rgba(100,50,20,0.55) 60%, rgba(44,24,16,0.2) 100%)' }}
        />
        <div className="relative flex flex-col justify-center items-start h-full px-8 md:px-20 py-32" style={{ minHeight: '85vh' }}>
          <p className="uppercase tracking-widest text-xs mb-4" style={{ color: '#e07a5f', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
            Bem-vindo ao
          </p>
          <h1
            className="mb-6 leading-none"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: '#f9f4ed',
              fontWeight: 700,
              maxWidth: '14ch',
            }}
          >
            Sabores do Mundo
          </h1>
          <p
            className="mb-10 leading-relaxed"
            style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.2rem', color: '#ede7dc', maxWidth: '42ch', opacity: 0.9 }}
          >
            Descubra receitas autênticas de sobremesas, massas, frutos do mar e culinárias internacionais. Explore, cozinhe e compartilhe.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => onCategory('pastas')}
              className="px-8 py-3 text-sm font-bold tracking-wide transition-all duration-200 hover:scale-105"
              style={{
                background: '#c45b3a',
                color: '#f9f4ed',
                fontFamily: 'Nunito, sans-serif',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.08em',
              }}
            >
              Explorar Receitas
            </button>
            <button
              onClick={onShare}
              className="px-8 py-3 text-sm font-bold tracking-wide transition-all duration-200 hover:scale-105"
              style={{
                background: 'transparent',
                color: '#f9f4ed',
                fontFamily: 'Nunito, sans-serif',
                border: '1.5px solid rgba(249,244,237,0.6)',
                borderRadius: '2px',
                cursor: 'pointer',
                letterSpacing: '0.08em',
              }}
            >
              Compartilhar Receita
            </button>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section className="py-16 px-8 md:px-20" style={{ background: '#2c1810' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { icon: '📖', label: 'Receitas Autênticas', desc: 'Cada receita testada e detalhada, com ingredientes e passo a passo completo.' },
            { icon: '🌍', label: 'Seis Categorias', desc: 'Sobremesas, pastas, pães, caldos, frutos do mar e culinária internacional.' },
            { icon: '👨‍🍳', label: 'Comunidade', desc: 'Compartilhe suas receitas favoritas e inspire outros amantes da cozinha.' },
          ].map(item => (
            <div key={item.label} className="flex flex-col gap-3">
              <span className="text-3xl">{item.icon}</span>
              <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#f9f4ed', fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                {item.label}
              </h3>
              <p style={{ fontFamily: 'Nunito, sans-serif', color: '#9b6845', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-8 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="uppercase tracking-widest text-xs mb-2" style={{ color: '#c45b3a', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
              Categorias
            </p>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#2c1810', fontWeight: 700, margin: 0 }}>
              O que vai cozinhar hoje?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <CategoryCard key={cat.id} cat={cat} onClick={() => onCategory(cat.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured recipes strip */}
      <section className="py-16 px-8 md:px-20" style={{ background: '#ede7dc' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="uppercase tracking-widest text-xs mb-2" style={{ color: '#c45b3a', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
              Destaques
            </p>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#2c1810', fontWeight: 700, margin: 0 }}>
              Receitas mais amadas
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.slice(0, 3).map(r => (
              <SmallRecipeCard key={r.id} recipe={r} onClick={() => {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Share CTA */}
      <section
        className="py-24 px-8 md:px-20 text-center"
        style={{
          background: 'linear-gradient(135deg, #c45b3a 0%, #6b4226 100%)',
        }}
      >
        <p className="uppercase tracking-widest text-xs mb-4" style={{ color: '#f9f4ed99', fontFamily: 'Nunito', fontWeight: 700 }}>
          Comunidade
        </p>
        <h2
          className="mb-5"
          style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#f9f4ed', fontWeight: 700, margin: '0 0 20px' }}
        >
          Tem uma receita especial?
        </h2>
        <p className="mb-8 mx-auto" style={{ fontFamily: 'Nunito', color: '#f9f4edcc', maxWidth: '44ch', lineHeight: 1.6, fontSize: '1.05rem' }}>
          Compartilhe com nossa comunidade e inspire outros cozinheiros ao redor do mundo.
        </p>
        <button
          onClick={onShare}
          className="px-10 py-4 font-bold tracking-wide transition-all duration-200 hover:scale-105"
          style={{ background: '#f9f4ed', color: '#c45b3a', fontFamily: 'Nunito', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '1rem', letterSpacing: '0.06em' }}
        >
          Compartilhar Minha Receita
        </button>
      </section>

      <Footer />
    </div>
  );
}

function CategoryCard({ cat, onClick }: { cat: typeof categories[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-left transition-all duration-300 hover:scale-[1.02]"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
    >
      <div className="relative overflow-hidden" style={{ height: '220px', borderRadius: '4px', background: '#c45b3a' }}>
        <img
          src={cat.image}
          alt={cat.label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ display: 'block' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.85) 0%, rgba(44,24,16,0.1) 60%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#f9f4ed', fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
              {cat.label}
            </h3>
          </div>
          <p style={{ fontFamily: 'Nunito', color: '#ede7dccc', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
            {cat.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function SmallRecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <div
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{ background: '#f9f4ed', borderRadius: '4px', border: '1px solid #ede7dc', cursor: 'pointer' }}
      onClick={onClick}
    >
      <div style={{ height: '160px', background: '#c45b3a', overflow: 'hidden' }}>
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h4 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2c1810', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px' }}>
          {recipe.title}
        </h4>
        <p style={{ fontFamily: 'Nunito', color: '#7a5c4a', fontSize: '0.82rem', margin: 0 }}>
          ⏱ {recipe.prepTime} · {recipe.difficulty}
        </p>
      </div>
    </div>
  );
}

// ─── CATEGORY PAGE ───────────────────────────────────────────────────────────

function CategoryPage({
  category,
  recipes,
  onBack,
  onRecipe,
}: {
  category: typeof categories[0];
  recipes: Recipe[];
  onBack: () => void;
  onRecipe: (id: number) => void;
}) {
  return (
    <div className="min-h-screen" style={{ background: '#f9f4ed' }}>
      <Nav onShare={() => {}} onHome={onBack} />

      {/* Category hero */}
      <div className="relative overflow-hidden" style={{ height: '360px' }}>
        <img
          src={category.image}
          alt={category.label}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.88) 0%, rgba(44,24,16,0.3) 100%)' }} />
        <div className="absolute bottom-0 left-0 px-8 md:px-20 pb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-sm transition-opacity hover:opacity-70"
            style={{ background: 'none', border: 'none', color: '#ede7dc', fontFamily: 'Nunito', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            ← Início
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span style={{ fontSize: '2rem' }}>{category.icon}</span>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#f9f4ed', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0 }}>
              {category.label}
            </h1>
          </div>
          <p style={{ fontFamily: 'Nunito', color: '#ede7dccc', margin: 0, fontSize: '1rem' }}>
            {category.description}
          </p>
        </div>
      </div>

      {/* Recipe grid */}
      <div className="max-w-6xl mx-auto px-8 md:px-20 py-16">
        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.5rem', color: '#7a5c4a' }}>
              Ainda não há receitas nesta categoria.
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'Nunito', color: '#7a5c4a', fontSize: '0.9rem', marginBottom: '2rem' }}>
              {recipes.length} {recipes.length === 1 ? 'receita encontrada' : 'receitas encontradas'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onRecipe(recipe.id)} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        background: '#fff',
        border: '1px solid #ede7dc',
        borderRadius: '4px',
        padding: 0,
        cursor: 'pointer',
        width: '100%',
      }}
    >
      {/* Photo */}
      <div className="relative overflow-hidden" style={{ height: '210px', background: '#c45b3a' }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {recipe.userSubmitted && (
          <div
            className="absolute top-3 right-3 px-2 py-1 text-xs font-bold"
            style={{ background: '#c45b3a', color: '#f9f4ed', fontFamily: 'Nunito', borderRadius: '2px', letterSpacing: '0.05em' }}
          >
            Da Comunidade
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '40px', background: 'linear-gradient(to top, rgba(44,24,16,0.4), transparent)' }} />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3
          className="line-clamp-2 mb-3"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2c1810', fontSize: '1.15rem', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.3 }}
        >
          {recipe.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-xs" style={{ fontFamily: 'Nunito', color: '#7a5c4a', fontWeight: 600 }}>
              <span>⏱</span> {recipe.prepTime}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ fontFamily: 'Nunito', color: '#7a5c4a', fontWeight: 600 }}>
              <span>👥</span> {recipe.servings} porções
            </span>
          </div>
          <span
            className="text-xs font-bold px-2 py-1"
            style={{
              fontFamily: 'Nunito',
              background: recipe.difficulty === 'Fácil' ? '#7a8c6e22' : recipe.difficulty === 'Médio' ? '#c45b3a22' : '#2c181022',
              color: recipe.difficulty === 'Fácil' ? '#4a6640' : recipe.difficulty === 'Médio' ? '#c45b3a' : '#2c1810',
              borderRadius: '2px',
              letterSpacing: '0.04em',
            }}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── RECIPE DETAIL PAGE ───────────────────────────────────────────────────────

function RecipePage({
  recipe,
  onBack,
  onHome,
  categoryLabel,
}: {
  recipe: Recipe;
  onBack: () => void;
  onHome: () => void;
  categoryLabel: string;
}) {
  return (
    <div className="min-h-screen" style={{ background: '#f9f4ed' }}>
      <Nav onShare={() => {}} onHome={onHome} />

      {/* Hero image */}
      <div className="relative overflow-hidden" style={{ height: '480px' }}>
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.92) 0%, rgba(44,24,16,0.15) 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-20 pb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-5 text-sm transition-opacity hover:opacity-70"
            style={{ background: 'none', border: 'none', color: '#ede7dc', fontFamily: 'Nunito', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            ← {categoryLabel}
          </button>
          <h1
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              color: '#f9f4ed',
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 700,
              margin: '0 0 12px',
              maxWidth: '16ch',
              lineHeight: 1.1,
            }}
          >
            {recipe.title}
          </h1>
          <div className="flex flex-wrap gap-4 items-center">
            <Pill icon="⏱" label={recipe.prepTime} />
            <Pill icon="👥" label={`${recipe.servings} porções`} />
            <Pill icon="🎯" label={recipe.difficulty} />
            {recipe.userSubmitted && recipe.author && <Pill icon="👨‍🍳" label={`Por ${recipe.author}`} />}
          </div>
        </div>
      </div>

      {/* Description strip */}
      <div style={{ background: '#2c1810', padding: '2rem 2rem' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', color: '#ede7dc', fontSize: '1.2rem', margin: 0, lineHeight: 1.7, textAlign: 'center' }}>
            "{recipe.description}"
          </p>
        </div>
      </div>

      {/* Content: ingredients + steps */}
      <div className="max-w-5xl mx-auto px-8 md:px-20 py-16 grid md:grid-cols-5 gap-12">
        {/* Ingredients */}
        <div className="md:col-span-2">
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2c1810', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 1.5rem' }}>
            Ingredientes
          </h2>
          <ul className="flex flex-col gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-start gap-3 py-3"
                style={{ borderBottom: '1px solid #ede7dc', fontFamily: 'Nunito', color: '#2c1810', fontSize: '0.97rem', lineHeight: 1.5 }}
              >
                <span style={{ color: '#c45b3a', fontWeight: 700, fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>✦</span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="md:col-span-3">
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2c1810', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 1.5rem' }}>
            Modo de Preparo
          </h2>
          <ol className="flex flex-col gap-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-5">
                <div
                  className="flex-shrink-0 flex items-center justify-center font-bold"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: '#c45b3a',
                    color: '#f9f4ed',
                    borderRadius: '50%',
                    fontFamily: 'Fraunces, Georgia, serif',
                    fontSize: '1rem',
                    marginTop: '2px',
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontFamily: 'Nunito', color: '#2c1810', fontSize: '0.97rem', lineHeight: 1.7, margin: 0 }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Pill({ icon, label }: { icon: string; label: string }) {
  return (
    <span
      className="flex items-center gap-2 px-3 py-1 text-sm font-semibold"
      style={{ background: 'rgba(249,244,237,0.18)', color: '#f9f4ed', borderRadius: '2px', fontFamily: 'Nunito', backdropFilter: 'blur(4px)' }}
    >
      <span>{icon}</span> {label}
    </span>
  );
}

// ─── SHARE PAGE ───────────────────────────────────────────────────────────────

function SharePage({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (r: Omit<Recipe, 'id'>) => void;
}) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: 'sobremesas' as Category,
    prepTime: '',
    servings: 4,
    difficulty: 'Fácil' as Recipe['difficulty'],
    description: '',
    image: '',
    ingredientsRaw: '',
    stepsRaw: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.ingredientsRaw || !form.stepsRaw) return;
    onSubmit({
      title: form.title,
      author: form.author || 'Anônimo',
      category: form.category,
      prepTime: form.prepTime || '30min',
      servings: form.servings,
      difficulty: form.difficulty,
      description: form.description,
      image: form.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&auto=format',
      ingredients: form.ingredientsRaw.split('\n').filter(Boolean),
      steps: form.stepsRaw.split('\n').filter(Boolean),
      userSubmitted: true,
    });
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontFamily: 'Nunito, sans-serif',
    fontSize: '0.95rem',
    border: '1.5px solid #ede7dc',
    borderRadius: '2px',
    background: '#fff',
    color: '#2c1810',
    outline: 'none',
  };

  const labelStyle = {
    fontFamily: 'Nunito, sans-serif',
    fontWeight: 700,
    fontSize: '0.85rem',
    color: '#6b4226',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    marginBottom: '6px',
    display: 'block',
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-8" style={{ background: '#f9f4ed' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2.5rem', color: '#2c1810', fontWeight: 700, margin: '0 0 1rem' }}>
          Receita Partilhada!
        </h2>
        <p style={{ fontFamily: 'Nunito', color: '#7a5c4a', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Obrigado por contribuir com a nossa comunidade.
        </p>
        <button
          onClick={onBack}
          className="px-8 py-3 font-bold transition-all hover:scale-105"
          style={{ background: '#c45b3a', color: '#f9f4ed', border: 'none', borderRadius: '2px', fontFamily: 'Nunito', cursor: 'pointer', fontSize: '1rem' }}
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f9f4ed' }}>
      <Nav onShare={() => {}} onHome={onBack} />

      <div className="max-w-2xl mx-auto px-8 md:px-20 py-16">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70"
          style={{ background: 'none', border: 'none', color: '#7a5c4a', fontFamily: 'Nunito', cursor: 'pointer', padding: 0, fontWeight: 600 }}
        >
          ← Início
        </button>

        <p className="uppercase tracking-widest text-xs mb-3" style={{ color: '#c45b3a', fontFamily: 'Nunito', fontWeight: 700 }}>
          Comunidade
        </p>
        <h1 className="mb-2" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#2c1810', fontWeight: 700, margin: '0 0 8px' }}>
          Compartilhe sua Receita
        </h1>
        <p className="mb-12" style={{ fontFamily: 'Nunito', color: '#7a5c4a', margin: '0 0 3rem', lineHeight: 1.6 }}>
          Preencha os campos abaixo. Ingredientes e passos: um por linha.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label style={labelStyle}>Nome da Receita *</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Bolo de Laranja da Vovó"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Seu Nome</label>
              <input
                style={inputStyle}
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                placeholder="Anônimo"
              />
            </div>
            <div>
              <label style={labelStyle}>Categoria *</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as Category })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tempo de Preparo</label>
              <input
                style={inputStyle}
                value={form.prepTime}
                onChange={e => setForm({ ...form, prepTime: e.target.value })}
                placeholder="Ex: 45min"
              />
            </div>
            <div>
              <label style={labelStyle}>Porções</label>
              <input
                type="number"
                style={inputStyle}
                value={form.servings}
                min={1}
                onChange={e => setForm({ ...form, servings: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={labelStyle}>Dificuldade</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value as Recipe['difficulty'] })}
              >
                <option>Fácil</option>
                <option>Médio</option>
                <option>Avançado</option>
              </select>
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>URL da Foto (opcional)</label>
              <input
                style={inputStyle}
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>Descrição breve</label>
              <input
                style={inputStyle}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Uma frase sobre a receita..."
              />
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>Ingredientes * (um por linha)</label>
              <textarea
                style={{ ...inputStyle, minHeight: '130px', resize: 'vertical' }}
                value={form.ingredientsRaw}
                onChange={e => setForm({ ...form, ingredientsRaw: e.target.value })}
                placeholder={"2 xícaras de farinha de trigo\n1 xícara de açúcar\n3 ovos"}
                required
              />
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>Modo de Preparo * (um passo por linha)</label>
              <textarea
                style={{ ...inputStyle, minHeight: '160px', resize: 'vertical' }}
                value={form.stepsRaw}
                onChange={e => setForm({ ...form, stepsRaw: e.target.value })}
                placeholder={"Pré-aqueça o forno a 180°C.\nMisture os ingredientes secos.\nBata os ovos e adicione..."}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-4 font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] mt-2"
            style={{
              background: '#c45b3a',
              color: '#f9f4ed',
              border: 'none',
              borderRadius: '2px',
              fontFamily: 'Nunito',
              cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            Publicar Receita
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

// ─── NAV & FOOTER ────────────────────────────────────────────────────────────

function Nav({ onShare, onHome, isHome }: { onShare: () => void; onHome: () => void; isHome?: boolean }) {
  return (
    <nav
      className="flex items-center justify-between px-8 md:px-20 py-5 sticky top-0 z-50"
      style={{ background: isHome ? 'transparent' : '#f9f4ed', borderBottom: isHome ? 'none' : '1px solid #ede7dc', backdropFilter: 'blur(12px)' }}
    >
      <button
        onClick={onHome}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: isHome ? '#f9f4ed' : '#2c1810' }}>
          Sabores do Mundo
        </span>
      </button>
      <button
        onClick={onShare}
        className="px-5 py-2 text-sm font-bold tracking-wide transition-all hover:scale-105"
        style={{
          background: '#c45b3a',
          color: '#f9f4ed',
          border: 'none',
          borderRadius: '2px',
          fontFamily: 'Nunito',
          cursor: 'pointer',
          letterSpacing: '0.06em',
        }}
      >
        + Compartilhar Receita
      </button>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="px-8 md:px-20 py-12" style={{ background: '#2c1810', marginTop: '4rem' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.2rem', color: '#f9f4ed', fontWeight: 600 }}>
          Sabores do Mundo
        </span>
        <p style={{ fontFamily: 'Nunito', color: '#7a5c4a', fontSize: '0.85rem', margin: 0 }}>
          © 2026 · Feito com amor e muito sabor
        </p>
      </div>
    </footer>
  );
}
