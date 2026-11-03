# PokéAtlas

> **Your complete Pokémon universe.**\
> Explore Pokémon, discover moves and abilities, understand type
> matchups, and become a better trainer.

PokéAtlas is a beginner-friendly Pokémon encyclopedia and battle
companion. It brings Pokémon species, moves, abilities, type
information, and battle-reference tools together in one searchable,
responsive web application.

The project is designed for both new players who need simple
explanations and experienced players who want detailed reference
information.

------------------------------------------------------------------------

## ✨ Features

### 📘 Pokédex

-   Browse Pokémon species across supported generations.
-   Search by Pokémon name or National Pokédex number.
-   Explore types, base stats, abilities, height, weight, and evolution
    information.
-   View alternate forms and regional variants where data is available.
-   Filter Pokémon by type, generation, and other supported attributes.

### ⚔️ Move Database

-   Browse moves from supported generations.
-   View each move's type, category, power, accuracy, PP, priority, and
    effect.
-   Filter by type, Physical / Special / Status category, generation,
    power, and accuracy.
-   View move descriptions, effect details, and compatible Pokémon
    learnsets where available.
-   Distinguish unavailable values from actual zero values.

### 🧬 Type Explorer

-   Explore all 18 Pokémon types.
-   See type strengths, weaknesses, resistances, and immunities.
-   Learn type matchups through beginner-friendly explanations.
-   View Pokémon and moves associated with each type.

### 🧮 Type Effectiveness Calculator

-   Select an attacking type and one or two defending types.
-   Calculate combined type effectiveness.
-   Display 4×, 2×, 1×, 0.5×, 0.25×, and 0× matchups.
-   Explain how each defending type contributes to the result.

### 🎯 Move Effectiveness Checker

-   Select a move and a defending Pokémon.
-   Review move information and type effectiveness.
-   Show the type multiplier separately from full battle damage.
-   Account for relevant mechanics when supported by the selected game
    rules.

### 🌟 Ability Database

-   Search and explore Pokémon abilities.
-   Read ability descriptions and battle effects.
-   Find Pokémon that can have each ability.
-   Identify hidden abilities where data is available.

### 🎓 Beginner Learning Center

Learn Pokémon battle basics, including: - Type advantages and
weaknesses - Dual-type Pokémon - STAB (Same-Type Attack Bonus) -
Physical, Special, and Status moves - Power, Accuracy, PP, and
Priority - Abilities and status conditions

### 🧠 Quiz

-   Practice type matchups and effectiveness multipliers.
-   Choose from Easy, Medium, and Hard difficulties.
-   Get feedback and explanations after answering.
-   Track your score without creating an account.

### 🔎 Global Search

Search across Pokémon, moves, types, and abilities from one place.

------------------------------------------------------------------------

## 🧭 Data Coverage

PokéAtlas is intended to cover the main-series Pokémon data available
through Generation 9:

  Generation     Region
  -------------- --------
  Generation 1   Kanto
  Generation 2   Johto
  Generation 3   Hoenn
  Generation 4   Sinnoh
  Generation 5   Unova
  Generation 6   Kalos
  Generation 7   Alola
  Generation 8   Galar
  Generation 9   Paldea

The modern type chart contains **18 types**, including Fairy.

> **Data accuracy note:** Availability and historical values can vary by
> game and generation. The application should distinguish global move
> data from moves actually obtainable by a Pokémon in a specific game.
> Do not display unsupported or unavailable historical information as
> fact.

PokéAtlas should only claim data is complete after the relevant datasets
have been imported and validated.

------------------------------------------------------------------------

## 🛠️ Tech Stack

The planned technology stack is:

  Area                        Technology
  --------------------------- -------------------------------
  Frontend                    React, Vite, TypeScript
  Styling                     Tailwind CSS
  Routing                     React Router
  Data fetching and caching   TanStack Query
  Icons                       Lucide React
  Animations                  Framer Motion (where useful)
  Primary data source         PokéAPI
  Local preferences           LocalStorage
  Larger offline datasets     IndexedDB (if needed)
  Unit testing                Vitest, React Testing Library
  Browser testing             Playwright

The exact stack may be adjusted to fit the existing project
implementation.

------------------------------------------------------------------------

## 📡 Data Sources

### PokéAPI

PokéAtlas uses [PokéAPI](https://pokeapi.co/) as its primary structured
source for Pokémon data.

-   API: https://pokeapi.co/api/v2/
-   Documentation: https://pokeapi.co/docs/v2

PokéAPI provides data for Pokémon, species, moves, types, abilities,
evolution chains, generations, and game versions.

### Additional references

Use reliable Pokémon game references to cross-check historical move
values, game-specific availability, and battle mechanics when necessary.

Always follow the relevant source's terms, attribution requirements, and
usage policies.

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

-   [Node.js](https://nodejs.org/) (use a current LTS release)
-   npm (included with Node.js), or another supported package manager
-   Git

### Installation

Clone the repository:

``` bash
git clone <your-repository-url>
cd pokeatlas
```

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

Open the local URL printed in your terminal (Vite commonly uses
`http://localhost:5173`).

### Production build

``` bash
npm run build
```

Preview the production build locally:

``` bash
npm run preview
```

### Tests

Run the available test scripts:

``` bash
npm run test
```

If the project uses separate scripts, check `package.json` for the exact
commands (for example, `test:unit` or `test:e2e`).

> These commands assume the corresponding scripts are configured in
> `package.json`. Update this section if the implementation uses
> different commands.

------------------------------------------------------------------------

## 🗂️ Suggested Project Structure

The exact structure may evolve as the application grows. A suggested
starting point:

``` text
pokeatlas/
├── public/
│   └── assets/
├── src/
│   ├── components/       # Shared UI components
│   ├── pages/            # Route-level pages
│   ├── features/
│   │   ├── pokedex/
│   │   ├── moves/
│   │   ├── types/
│   │   ├── abilities/
│   │   ├── calculator/
│   │   └── quiz/
│   ├── services/         # API clients and data access
│   ├── data/             # Cached or generated datasets
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Matchup and battle helpers
│   └── main.tsx
├── scripts/               # Data import and sync scripts
├── tests/
├── package.json
└── README.md
```

------------------------------------------------------------------------

## 🧮 Type Effectiveness

PokéAtlas uses type multipliers to explain how effective an attack is
against a defending Pokémon.

    Multiplier Meaning
  ------------ --------------------------------
            4× Double weakness
            2× Super effective
            1× Normal effectiveness
          0.5× Not very effective
         0.25× Double resistance
            0× No damage due to type immunity

For dual-type Pokémon, multiply the effectiveness against each defending
type.

**Example: Charizard (Fire / Flying)**

-   Rock: 2× against Fire × 2× against Flying = **4×**
-   Water: 2× against Fire × 1× against Flying = **2×**
-   Electric: 1× against Fire × 2× against Flying = **2×**
-   Grass: 0.5× against Fire × 0.5× against Flying = **0.25×**
-   Ground: 1× against Fire × 0× against Flying = **0×**

The type multiplier is not the same as the final damage dealt in a
Pokémon battle. Full damage can also depend on move power, stats, STAB,
abilities, held items, weather, and game-specific mechanics.

------------------------------------------------------------------------

## 🧪 Testing and Validation

Battle calculations are especially important and should be covered by
automated tests.

Test at least:

-   All 18 attacking and defending type interactions.
-   Single-type and dual-type defenders.
-   Immunities and combined multipliers.
-   Double weaknesses and double resistances.
-   Game- and generation-specific differences where implemented.
-   Missing or unavailable move attributes.
-   Search, sorting, filtering, and pagination.
-   API failures and cached-data fallbacks.

Useful regression examples:

  Pokémon                     Incoming attack type     Expected type multiplier
  --------------------------- ---------------------- --------------------------
  Charizard (Fire / Flying)   Rock                                           4×
  Charizard (Fire / Flying)   Water                                          2×
  Charizard (Fire / Flying)   Ground                                         0×
  Gyarados (Water / Flying)   Electric                                       4×
  Gyarados (Water / Flying)   Ground                                         0×

Abilities such as Wonder Guard must be handled separately from ordinary
type effectiveness.

------------------------------------------------------------------------

## 🗺️ Development Roadmap

-   [ ] Set up the application and design system.
-   [ ] Build the shared navigation and responsive layout.
-   [ ] Integrate PokéAPI and implement caching.
-   [ ] Import and validate Pokémon data.
-   [ ] Build the Pokédex and Pokémon detail pages.
-   [ ] Import and validate move data.
-   [ ] Build move search, filters, and detail pages.
-   [ ] Build the 18-type explorer.
-   [ ] Implement and test the type effectiveness calculator.
-   [ ] Build the move effectiveness checker.
-   [ ] Import and display ability data.
-   [ ] Create the beginner learning center.
-   [ ] Build the interactive quiz.
-   [ ] Add game-version and generation filters.
-   [ ] Add dark and light themes.
-   [ ] Test accessibility, responsiveness, and performance.
-   [ ] Verify data coverage and document known limitations.

------------------------------------------------------------------------

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1.  Fork the repository.

2.  Create a feature branch:

    ``` bash
    git checkout -b feat/your-feature
    ```

3.  Make your changes and add tests where appropriate.

4.  Run the relevant checks.

5.  Commit your changes:

    ``` bash
    git commit -m "feat: describe your change"
    ```

6.  Push your branch and open a Pull Request.

For data-related changes, include the source and explain how the
information was verified.

------------------------------------------------------------------------

## ⚖️ Disclaimer

PokéAtlas is a fan-made, unofficial Pokémon reference project. It is not
affiliated with, endorsed by, or sponsored by Nintendo, The Pokémon
Company, Game Freak, or Creatures Inc.

Pokémon, Pokémon character names, images, and related trademarks are the
property of their respective owners. All third-party data and assets
remain subject to their respective licenses and terms.

------------------------------------------------------------------------

## 📜 License

Choose and add a license before distributing this project. If you intend
to make the source code open source, include the appropriate `LICENSE`
file in the repository.

------------------------------------------------------------------------

**PokéAtlas --- Explore. Learn. Battle.**
