import Link from "next/link";

const sections = [
  {
    role: "Frontend",
    levels: [
      {
        tasks: [
          "Привести расчет итоговой суммы заказа к корректному и предсказуемому результату.",
          "Сделать статусы заказов понятными для пользователя: и по тексту, и визуально.",
          "Оформить пустой список так, чтобы пользователь понимал, что происходит и что делать дальше.",
        ],
        files: ["src/components/orders/OrdersList.tsx", "src/utils/order.ts"],
      },
      {
        tasks: [
          "Убрать избыточные обращения к API при поиске и фильтрации.",
          "Сделать работу списка более плавной при поиске, фильтрации и сортировке.",
          "Снизить количество лишних обновлений во время ввода в поиск.",
          "Убрать повторяющуюся логику форматирования и оставить единый источник правды.",
        ],
        files: ["src/components/orders/OrdersList.tsx", "src/hooks/useDebounce.ts", "src/utils/format.ts"],
      },
      {
        tasks: [
          "Сделать загрузку данных устойчивой к временным сбоям и удобной для повторной попытки.",
          "Обеспечить быстрый отклик интерфейса при изменении статуса заказа и корректное восстановление при ошибке.",
          "Привести состояния загрузки, ошибки и отсутствия данных к единому и понятному UX.",
        ],
        files: ["src/app/page.tsx", "src/hooks/useOrders.ts", "src/components/common/*"],
      },
    ],
  },
  {
    role: "Backend",
    levels: [
      {
        tasks: [
          "Усилить проверку входных параметров пагинации и обрабатывать некорректные значения предсказуемо.",
          "Проверить корректность адреса доставки при создании заказа.",
          "Сделать формат ошибок единым и понятным для клиента API.",
        ],
        files: ["backend/controllers/ordersController.js", "backend/middleware/validatePagination.js"],
      },
      {
        tasks: [
          "Зафиксировать допустимые значения статусов заказа на уровне бизнес-логики.",
          "Описать и применить корректные переходы между статусами.",
          "Выделить доменные проверки в переиспользуемые функции.",
        ],
        files: ["backend/controllers/ordersController.js", "backend/utils/*"],
      },
      {
        tasks: [
          "Расширить endpoint топ-клиентов так, чтобы им было удобно пользоваться в реальном сценарии менеджера.",
          "Обработать нетипичные и пограничные случаи в аналитике без поломки ответа API.",
          "Подготовить вычислительную часть к надежному модульному тестированию.",
        ],
        files: ["backend/controllers/analyticsController.js", "backend/routes/analyticsRoutes.js", "backend/utils/*"],
      },
    ],
  },
  {
    role: "Fullstack",
    levels: [
      {
        tasks: [
          "Добавить новое поле комментария к заказу и провести его через весь поток данных.",
          "Убедиться, что сценарий создания и просмотра заказа работает сквозным образом без регрессий.",
        ],
        files: ["backend/controllers/ordersController.js", "src/types/index.ts", "src/app/page.tsx"],
      },
      {
        tasks: [
          "Сделать фильтрацию и пагинацию согласованными между интерфейсом и API.",
          "Показать пользователю ключевую информацию о размере выборки и возможности подгрузки.",
          "Обеспечить корректное поведение списка при смене параметров фильтрации.",
        ],
        files: ["backend/controllers/ordersController.js", "src/services/api.ts", "src/hooks/useOrders.ts", "src/app/page.tsx"],
      },
      {
        tasks: [
          "Реализовать менеджерский виджет топ-клиентов как завершенную сквозную фичу.",
          "Согласовать серверные параметры выборки и управляющие элементы на клиенте.",
          "Сделать поведение виджета устойчивым в состояниях загрузки, ошибки и пустых данных.",
        ],
        files: ["backend/controllers/analyticsController.js", "src/services/api.ts", "src/components/common/*", "src/app/page.tsx"],
      },
    ],
  },
];

export default function TasksPage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Задания</h1>
        </div>
        <Link href="/" className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
          К заказам
        </Link>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.role} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">{section.role}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {section.levels.map((level) => (
                <article key={level.tasks.join(",")} className="rounded-lg border border-gray-200 p-4">
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {level.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs font-medium text-gray-500">Файлы:</p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-600">
                    {level.files.map((file) => (
                      <li key={file} className="rounded bg-gray-50 px-2 py-1 font-mono">
                        {file}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
