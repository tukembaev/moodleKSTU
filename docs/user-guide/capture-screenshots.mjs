import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(__dirname, "screenshots");
const BASE = "https://lms.kstu.kg";
const LOGIN = "reatoi";
const PASSWORD = "Beksultan-04";

fs.mkdirSync(SHOTS, { recursive: true });

const shot = async (page, name) => {
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(SHOTS, `${name}.png`),
    fullPage: false,
  });
  console.log("saved", name);
};

const main = async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    locale: "ru-RU",
  });

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "ПИН" }).fill(LOGIN);
  await page.getByRole("textbox", { name: "Пароль" }).fill(PASSWORD);
  await shot(page, "01-login");
  await page.getByRole("button", { name: "Войти" }).click();

  const employee = page.getByRole("button", { name: /Сотрудник/i });
  try {
    await employee.waitFor({ timeout: 4000 });
    await employee.click();
  } catch {
    /* already in */
  }

  await page.waitForURL(/\/(today|courses)/, { timeout: 20000 });
  await page.waitForTimeout(800);
  await shot(page, "02-today");

  await page.goto(`${BASE}/courses`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Мои курсы" }).waitFor();
  await shot(page, "03-my-courses");

  await page.getByText("Добавить курс").first().click();
  await page.getByRole("dialog", { name: "Создание курса" }).waitFor();
  await page.getByPlaceholder("Введите название курса").waitFor();
  await page.waitForTimeout(500);
  await shot(page, "04-add-course");
  await page.keyboard.press("Escape");

  await page.getByRole("heading", { name: "LMS 4" }).click({ force: true }).catch(() => {});
  await page.getByRole("button", { name: "Открыть" }).nth(3).click();
  await page.waitForTimeout(1500);
  await shot(page, "05-course-study");

  const addTheme = page.getByRole("button", { name: /^Добавить/ }).first();
  if (await addTheme.isVisible().catch(() => false)) {
    await addTheme.click();
    await page.waitForTimeout(1200);
    await shot(page, "06-add-theme");
    const typeTrigger = page.getByRole("combobox").first();
    if (await typeTrigger.isVisible().catch(() => false)) {
      await typeTrigger.click();
      await page.waitForTimeout(400);
      await shot(page, "07-add-theme-types");
      await page.keyboard.press("Escape");
    }
    await page.keyboard.press("Escape");
  }

  const tabs = [
    ["Лента курса", "08-course-feed"],
    ["Материалы", "09-course-materials"],
    ["О курсе", "10-about-course"],
    ["Успеваемость студентов", "11-students-progress"],
    ["Управление курсом", "12-course-management"],
  ];
  for (const [label, file] of tabs) {
    const tab = page.getByRole("tab", { name: new RegExp(label) });
    if (await tab.count()) {
      await tab.first().click();
      await page.waitForTimeout(900);
      await shot(page, file);
    }
  }

  const invite = page.getByRole("button", { name: /приглас|QR|доступ/i }).first();
  if (await invite.isVisible().catch(() => false)) {
    await invite.click();
    await page.waitForTimeout(700);
    await shot(page, "13-invite");
    await page.keyboard.press("Escape");
  }

  await page.goto(`${BASE}/test`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "14-my-tests");

  const addTest = page.getByText(/Добавьте новый тест|Добавить тест|новый тест/i).first();
  if (await addTest.isVisible().catch(() => false)) {
    await addTest.click();
  } else {
    await page.goto(`${BASE}/test/add-quiz`, { waitUntil: "networkidle" });
  }
  await page.waitForTimeout(1000);
  await shot(page, "15-add-quiz");
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(400);
  await shot(page, "16-add-quiz-questions");

  await page.goto(`${BASE}/question-bank`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "17-question-bank");

  await page.goto(`${BASE}/guide`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "18-guide");

  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
