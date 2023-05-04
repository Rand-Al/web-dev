import s from "../styles/Test.module.css";
const Test = () => {
  return (
    <div>
     function formatTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) {
    return "менш ніж хвилину тому";
  } else if (diffInMinutes === 1) {
    return "1 хвилину тому";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} хвилин назад`;
  } else if (diffInMinutes === 60) {
    return "1 годину тому";
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} годин назад`;
  }
}
Ця функція приймає дату відправки коментаря і повертає форматований текст з пройденим часом.

Щоб використати цю функцію, спочатку додайте data-time атрибут до елементу коментаря, який буде містити час відправки коментаря в мілісекундах:

html
Copy code
<li class="comment" data-time="1620070513000">Це мій коментар</li>
Потім, використайте цю функцію для форматування тексту коментаря:

javascript
Copy code
function updateTimeAgo() {
  const commentElements = document.querySelectorAll('.comment');
  commentElements.forEach(commentElement => {
    const timestamp = commentElement.getAttribute('data-time');
    const date = new Date(parseInt(timestamp));
    const timeAgo = formatTimeAgo(date);
    commentElement.innerText = `${commentElement.innerText} - ${timeAgo}`;
  });
}

setInterval(updateTime




User
продовжи
ChatGPT
Останнім кроком є оновлення тексту коментаря за допомогою setInterval. Викличіть функцію updateTimeAgo кожну хвилину, щоб оновити текст коментаря з новим форматованим часом:

javascript
Copy code
setInterval(updateTimeAgo, 60000); // оновлювати кожну хвилину
Тепер, при кожному оновленні, текст коментаря буде містити відформатований час пройденого часу. Наприклад, якщо коментар відправився 5 хвилин тому, текст коментаря буде виглядати як "Це мій коментар - 5 хвилин назад". Зауважте, що ви можете налаштувати setInterval, щоб оновлювати час менш або більше часто, якщо ви хочете.
    </div>
  );
};

export default Test;

// export async function getServerSideProps() {
//   const res = await axios.get(`${process.env.API_URL}/api/test`);
//   const usersList = res.data;
//   return { props: { usersList } };
// }
