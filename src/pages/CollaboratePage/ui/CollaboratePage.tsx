import { Mail, Phone, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CollaboratePage() {
  const { t } = useTranslation();
  return (
    <div className="px-6 py-12 max-w-5xl mx-auto space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{t("Сотрудничайте с нами")}</h1>
        <p className="text-lg text-muted-foreground">
          {t(
            "Мы открыты к новым партнёрствам, коллаборациям и идеям. Свяжитесь с нами — вместе мы сделаем больше."
          )}
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          {t("Почему стоит работать с нами?")}
        </h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>{t("У нас сильное комьюнити разработчиков")}</li>
          <li>{t("Мы создаём полезные инструменты и ресурсы для роста")}</li>
          <li>{t("Гарантируем прозрачность и честные условия")}</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("Наши партнёры")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
          <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center font-medium">
            {t("Партнёр 1")}
          </div>
          <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center font-medium">
            {t("Партнёр 2")}
          </div>
          <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center font-medium">
            {t("Партнёр 3")}
          </div>
          <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center font-medium">
            {t("Партнёр 4")}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("Форма обратной связи")}</h2>
        <form className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder={t("Имя")}
            className="border p-3 rounded-md col-span-2 md:col-span-1"
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-md col-span-2 md:col-span-1"
          />
          <textarea
            placeholder={t("Сообщение")}
            rows={4}
            className="border p-3 rounded-md col-span-2"
          ></textarea>
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-md w-fit hover:bg-gray-800"
          >
            {t("Отправить")}
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("Наши контакты")}</h2>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <span>contact@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <span>+7 (999) 123-45-67</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <span>{t("Москва, ул. Разработчиков, д. 10")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
