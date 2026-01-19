import { useForm } from "react-hook-form";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Textarea } from "shared/shadcn/ui/textarea";
import { Label } from "shared/shadcn/ui/label";
import { LuCloudUpload, LuX } from "react-icons/lu";
import { useCreateRemark } from "../model/services/remarkQueryFactory";

interface AddRemarkFormProps {
    onSubmit?: (data: {
        theme_id: string;
        student_id: number;
        title?: string;
        message: string;
    }) => void;
    onCancel: () => void;
    theme_id: string;
    student_id: number;
}

interface FormValues {
    title: string;
    message: string;
}

export const AddRemarkForm: React.FC<AddRemarkFormProps> = ({
    onSubmit,
    onCancel,
    theme_id,
    student_id,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>();

    const createRemarkMutation = useCreateRemark();

    const onFormSubmit = (data: FormValues) => {
        createRemarkMutation.mutate(
            {
                theme_id,
                student_id,
                title: data.title || undefined,
                message: data.message,
            },
            {
                onSuccess: () => {
                    reset();
                    onCancel();
                    onSubmit?.({
                        theme_id,
                        student_id,
                        title: data.title,
                        message: data.message,
                    });
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="title">Заголовок замечания</Label>
                <Input
                    id="title"
                    placeholder="Например: Ошибки в оформлении"
                    {...register("title", { required: true })}
                />
                {errors.title && (
                    <span className="text-xs text-red-500">Заголовок обязателен</span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="message">Текст сообщения</Label>
                <Textarea
                    id="message"
                    placeholder="Опишите замечание подробно..."
                    rows={4}
                    {...register("message", { required: true })}
                />
                {errors.message && (
                    <span className="text-xs text-red-500">
                        Текст сообщения обязателен
                    </span>
                )}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={onCancel}
                >
                    <LuX className="mr-2 h-4 w-4" /> Отмена
                </Button>
                <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={createRemarkMutation.isPending}
                >
                    <LuCloudUpload className="mr-2 h-4 w-4" />
                    Отправить замечание
                </Button>
            </div>
        </form>
    );
};
