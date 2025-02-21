import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate()
    return (
        <div>
            <button type="button" onClick={() => navigate(-1)}>
                Назад
            </button>
        </div>
    )
}

export default memo(NotFoundPage)
