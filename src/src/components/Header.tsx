import NotificationNavbar from "./NotificationNavbar";

const Header = () => {
  return (
    <section>
      <div className="px-10 py-7 flex justify-between items-center">
        <h1 className="font-bold">Welcome back to NEST 👋</h1>
        <NotificationNavbar />
      </div>
    </section>
  );
};

export default Header;
