const FIRST_NAMES = [
  "Александр", "Алексей", "Алина", "Анастасия", "Андрей", "Антон", "Артем", "Валерия",
  "Василий", "Виктор", "Виктория", "Владимир", "Георгий", "Дарья", "Денис", "Дмитрий",
  "Евгений", "Егор", "Екатерина", "Елена", "Иван", "Игорь", "Илья", "Кирилл",
  "Ксения", "Лев", "Марина", "Мария", "Максим", "Наталья", "Никита", "Олег",
  "Ольга", "Павел", "Полина", "Роман", "Сергей", "Светлана", "София", "Тимур",
  "Юлия", "Ярослав",
];

const LAST_NAMES = [
  "Абрамов", "Алексеев", "Андреев", "Баранов", "Белов", "Богданов", "Васильев", "Виноградов",
  "Волков", "Гаврилов", "Горбунов", "Громов", "Давыдов", "Данилов", "Егоров", "Ершов",
  "Жуков", "Зайцев", "Захаров", "Ильин", "Калинин", "Киселев", "Ковалев", "Комаров",
  "Корнилов", "Крылов", "Кузнецов", "Лебедев", "Макаров", "Мельников", "Миронов", "Морозов",
  "Николаев", "Орлов", "Павлов", "Петров", "Поляков", "Романов", "Савельев", "Семенов",
  "Сидоров", "Смирнов", "Соколов", "Степанов", "Тарасов", "Титов", "Федоров", "Фролов",
  "Чернов", "Шестаков",
];

const PATRONYMICS = [
  "Александрович", "Александровна", "Алексеевич", "Алексеевна", "Андреевич", "Андреевна",
  "Викторович", "Викторовна", "Владимирович", "Владимировна", "Дмитриевич", "Дмитриевна",
  "Евгеньевич", "Евгеньевна", "Игоревич", "Игоревна", "Ильич", "Ильинична",
  "Николаевич", "Николаевна", "Павлович", "Павловна", "Романович", "Романовна",
  "Сергеевич", "Сергеевна", "Юрьевич", "Юрьевна",
];

const CITIES = [
  "Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск", "Краснодар",
  "Нижний Новгород", "Ростов-на-Дону", "Самара", "Уфа", "Пермь", "Воронеж",
];

const STREETS = [
  "Ленина", "Советская", "Центральная", "Победы", "Молодежная", "Школьная", "Садовая",
  "Гагарина", "Мира", "Полевая", "Лесная", "Набережная", "Октябрьская", "Парковая",
  "Космонавтов", "Строителей", "Рабочая", "Юбилейная", "Солнечная", "Тихая",
];

const ADDRESS_ALIASES = ["Дом", "Работа", "Офис", "Квартира", "Родители", "Склад"];

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, ".")
    .replace(/^\.+|\.+$/g, "");
}

function buildAddress(userIndex, addressIndex) {
  const city = CITIES[(userIndex + addressIndex * 3) % CITIES.length];
  const street = STREETS[(userIndex * 2 + addressIndex) % STREETS.length];
  const house = String(((userIndex * 7 + addressIndex * 5) % 180) + 1);
  const apartment = String(((userIndex * 13 + addressIndex * 11) % 350) + 1);
  const floor = String(((userIndex + addressIndex) % 24) + 1);
  const postalCode = String(100000 + ((userIndex * 173 + addressIndex * 47) % 900000));
  const intercom = (userIndex + addressIndex) % 4 === 0 ? null : `${apartment}к`;

  return {
    id: `addr_${String(userIndex + 1).padStart(4, "0")}_${addressIndex + 1}`,
    alias: ADDRESS_ALIASES[(userIndex + addressIndex) % ADDRESS_ALIASES.length],
    postalCode,
    city,
    street: `ул. ${street}`,
    house,
    apartment,
    floor,
    intercom,
  };
}

function buildUser(index) {
  const id = String(1001 + index);
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index * 3 + 5) % LAST_NAMES.length];
  const patronymic = PATRONYMICS[(index * 5 + 2) % PATRONYMICS.length];
  const emailLocal = `${toSlug(firstName)}.${toSlug(lastName)}.${String(index + 1).padStart(3, "0")}`;
  const phoneTail = String(1000000 + ((index * 7919 + 123456) % 9000000));
  const registeredAt = new Date(
    Date.UTC(
      2023 + (index % 3),
      (index * 7) % 12,
      ((index * 11) % 28) + 1,
      (index * 3) % 24,
      (index * 17) % 60,
      0
    )
  ).toISOString();

  const addressCount = 1 + (index % 3);
  const deliveryAddresses = Array.from({ length: addressCount }, (_, addressIndex) =>
    buildAddress(index, addressIndex)
  );

  return {
    id,
    email: `${emailLocal}@example.com`,
    phone: `+7 (${900 + (index % 100)}) ${phoneTail.slice(0, 3)}-${phoneTail.slice(3, 5)}-${phoneTail.slice(5, 7)}`,
    firstName,
    lastName,
    patronymic,
    registeredAt,
    isSubscribed: index % 4 !== 0,
    deliveryAddresses,
  };
}

const users = Array.from({ length: 220 }, (_, index) => buildUser(index));

module.exports = users;