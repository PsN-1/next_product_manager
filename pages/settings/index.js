export function getServerSideProps() {}
export default function Settings({ data }) {
  return (
    <div>
      <h1>Settings</h1>
      {data.map((item) => (
        <div key={item.id}>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}
