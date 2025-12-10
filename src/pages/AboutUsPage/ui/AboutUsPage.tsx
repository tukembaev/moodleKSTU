import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  О платформе
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Создавай, обучай, зарабатывай — всё в одном месте
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Наша платформа — это удобный инструмент для создания
                  собственных курсов, управления учебным процессом, организации
                  тестирования и получения дохода от обучения. Принимай ответы
                  от студентов, прикрепляй материалы, добавляй Google формы,
                  отслеживай успеваемость и контролируй финансы в одном месте.
                </p>
              </div>
              <img
                src="https://cdn.pixabay.com/photo/2018/01/17/07/06/laptop-3087585_1280.jpg"
                width="550"
                height="310"
                alt="About Us"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Наша команда
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Люди, стоящие за проектом
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Мы — команда, увлечённая технологиями и образованием. Мы
                  создаём инструменты, которые помогают преподавателям делиться
                  знаниями, а студентам — учиться эффективно и интересно.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Avatar>
                  <AvatarImage src="https://images.pexels.com/photos/374916/pexels-photo-374916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-bold">Иван Иванов</h3>
                  <p className="text-muted-foreground">Основатель</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <Avatar>
                  <AvatarImage src="https://images.pexels.com/photos/2804980/pexels-photo-2804980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-bold">Мария Смирнова</h3>
                  <p className="text-muted-foreground">Технический директор</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <Avatar>
                  <AvatarImage src="https://images.pexels.com/photos/3777655/pexels-photo-3777655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-bold">Алексей Кузнецов</h3>
                  <p className="text-muted-foreground">Frontend-разработчик</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Наша миссия
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Образование должно быть доступным и удобным
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Мы стремимся предоставить каждому возможность создавать и
                  проходить качественные онлайн-курсы. Наша цель — сделать
                  процесс обучения простым, гибким и финансово выгодным как для
                  преподавателя, так и для студента.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Наши ценности</h3>
                  <p className="text-muted-foreground">
                    Основные принципы, которыми мы руководствуемся:
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary" />
                    <span>Простота — обучение не должно быть сложным.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary" />
                    <span>
                      Доступность — возможность учиться и обучать где угодно.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary" />
                    <span>
                      Прозрачность — ясная система оплаты, доходов и статистики.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary" />
                    <span>
                      Развитие — постоянное улучшение платформы и обучение
                      пользователей.
                    </span>
                  </li>
                </ul>
              </div>
              <img
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                width="550"
                height="310"
                alt="Our Values"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Достижения
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Наши ключевые шаги вперёд
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Мы гордимся тем, как быстро развиваемся, поддерживаем
                  пользователей и внедряем полезные функции, делая платформу
                  сильным помощником в сфере онлайн-образования.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                  <AwardIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold">Инновационный подход</h3>
                  <p className="text-muted-foreground">
                    Комбинация гибкого курса и внешнего тестирования.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                  <ScalingIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold">Быстрый рост</h3>
                  <p className="text-muted-foreground">
                    С каждым днём к платформе присоединяются новые преподаватели
                    и студенты.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold">Доверие пользователей</h3>
                  <p className="text-muted-foreground">
                    Более 90% пользователей возвращаются к новым курсам.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col gap-2 justify-center items-center pt-4">
        <div className="mx-auto mt-5 max-w-2xl text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Давайте развиваться вместе!
          </h1>
        </div>
        {/* End Title */}
        <div className="mx-auto mt-5 max-w-3xl text-center">
          <p className="text-muted-foreground text-xl">
            Присоединяйтесь к нам и начните создавать свои курсы уже сегодня!
            Наша команда всегда готова помочь вам на каждом шаге.
          </p>
        </div>
        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-3">
          <Button size={"lg"}>Войти</Button>
          <Button size={"lg"} variant={"outline"}>
            Зарегистрироваться
          </Button>
        </div>
      </section>
    </div>
  );
}

function AwardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ScalingIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 3v6h-6" />
      <path d="M3 21v-6h6" />
      <path d="M3 9l9 9" />
      <path d="M21 15L12 6" />
    </svg>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6" />
      <path d="M23 11h-6" />
    </svg>
  );
}
