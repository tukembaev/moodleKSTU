import { FC } from 'react'
import { useTranslation } from "react-i18next";

interface ErrorWidgetProps {
    className?: string
}

export const ErrorWidget: FC<ErrorWidgetProps> = () => {
    const { t } = useTranslation();
    const reloadPage = () => {

        location.reload()
    }   

    return (
        <div>
            <p>{t("Произошла непредвиденная ошибка")}</p>
            <button onClick={reloadPage}>
                {t("Обновить страницу")}
            </button>
        </div>
    )
}
