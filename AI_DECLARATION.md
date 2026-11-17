# AI Declaration – Individual Project (AI-1)

Course: VR 113153 Web Development II
Project: RecipeBox – World Recipes Finder (TheMealDB API)

| Item | Your answer |
|---|---|
| **Student name / ID** | Aleksei Ponomarev / [35324] |
| **AI tool(s) used** | Claude (Anthropic) |
| **What I asked the AI to do** | 1) Write the error-handling parts of my app, in simple beginner-friendly code with short comments: (1) createApiError() and apiGet() in the Axios service — handling timeouts, invalid API key (401/403), rate limit (429), API 404, other 4xx/5xx, network errors and non-JSON responses; (2) the showMeal() controller for GET /meal/:id; (3) connecting the 404 and error middleware in app.js; (4) the notFound() and errorHandler() middleware. I also asked it to explain next() vs next(err), why a function with 4 arguments is an error handler in Express, and why the server does not crash when the API fails. 2) Complete all AI declaration part and write down parts that I have done by myself and parts which you created yourself. |
| **Which files/parts contain AI-assisted code** | services/mealService.js — createApiError() and apiGet() only. controllers/mealController.js — showMeal() only. app.js — the two lines app.use(notFound) and app.use(errorHandler) with their comments. middleware/errorHandler.js — the whole file (notFound, errorHandler, module.exports). |
| **What I changed, tested or wrote myself** | I wrote everything else myself: project structure, package.json, .env.example, the Axios instance and all API functions in mealService.js, routes, all other controller functions, validateSearch and logger middleware, utils/mealHelpers.js, all EJS views and partials, CSS and README. For the AI-assisted parts I wrote the TODO specifications (which status code and message for each failure). The AI tested every error case against a fake local API. I then checked the AI-assisted parts myself: I opened /meal/abc (invalid id → error page), /nope (unknown route → 404 page), and started the app with a wrong API_BASE_URL (network error → friendly error page, server kept running). |
| **I confirm I understand and can explain all submitted code** | Yes |

I keep my AI prompts and outputs for 30 days after final grades are issued and can show them on request.
