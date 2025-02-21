import { FC } from 'react'

interface ErrorWidgetProps {
    className?: string
}

export const ErrorWidget: FC<ErrorWidgetProps> = () => {
    const reloadPage = () => {

        location.reload()
    }   

    return (
        <div>
            <p>Произошла непредвиденная ошибка</p>
            <button onClick={reloadPage}>
                Обновить страницу
            </button>
        </div>
    )
}
