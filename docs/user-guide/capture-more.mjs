import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(__dirname, "screenshots");
const BASE = "https://lms.kstu.kg";

const shot = async (page, name) => {
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`) });
  console.log("saved", name);
};

const login = async (page) => {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(page, "01-login");
  await page.getByRole("textbox", { name: "ПИН" }).fill("reatoi");
  await page.getByRole("textbox", { name: "Пароль" }).fill("Beksultan-04");
  await page.getByRole("button", { name: "Войти" }).click();
  const employee = page.getByRole("button", { name: /Сотрудник/i });
  try {
    await employee.waitFor({ timeout: 3500 });
    await employee.click();
  } catch {
    /* ok */
  }
  await page.waitForURL(/\/(today|courses)/, { timeout: 20000 });
};

const main = async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    locale: "ru-RU",
  });
  await login(page);

  await page.goto(`${BASE}/courses`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "LMS 4" }).waitFor();
  await page.getByRole("button", { name: "Открыть" }).nth(3).click();
  await page.getByRole("heading", { name: "LMS 4" }).waitFor({ timeout: 20000 });
  await page.waitForTimeout(800);

  await page.getByRole("heading", { name: "Глоссарий 1" }).click();
  await page.waitForTimeout(900);
  await shot(page, "08-theme-selected");

  const addMaterial = page.getByRole("button", {
    name: "Добавить учебный материал",
  });
  if (await addMaterial.isVisible().catch(() => false)) {
    await addMaterial.click({ force: true });
    await page.waitForTimeout(1000);
    await shot(page, "09-add-material");
    await page.keyboard.press("Escape");
  }

  for (const [name, file] of [
    ["Лента курса", "10-course-feed"],
    ["Материалы", "11-course-files"],
    ["О курсе", "12-about-course"],
    ["Успеваемость студентов", "13-students-progress"],
    ["Управление курсом", "14-course-management"],
  ]) {
    await page.getByRole("tab", { name }).click();
    await page.waitForTimeout(1000);
    await shot(page, file);
  }

  await page.getByRole("tab", { name: "Учебный процесс" }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "Добавить" }).click();
  await page.getByRole("dialog", { name: "Создание темы" }).waitFor();
  await page.getByRole("combobox").first().click();
  await page.getByRole("option", { name: "Лекционные материалы" }).click();
  await page.waitForTimeout(500);
  await shot(page, "15-add-theme-lecture");
  await page.getByRole("combobox").first().click();
  await page.getByRole("option", { name: "Тесты" }).click();
  await page.waitForTimeout(500);
  await shot(page, "16-add-theme-test");
  await page.keyboard.press("Escape");

  await page.goto(`${BASE}/test/add-quiz`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 520));
  await page.waitForTimeout(400);
  await shot(page, "17-add-quiz-question-card");

  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
