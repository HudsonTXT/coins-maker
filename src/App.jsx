import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

function App() {
  const isMounted = useRef(false);
  const [coins, setCoins] = useState(() => {
    const userObject = JSON.parse(localStorage.getItem("userObject"));
    return userObject ? userObject.coins : 0;
  });
  const [coinsPerTap, setCoinsPerTap] = useState(() => {
    const userObject = JSON.parse(localStorage.getItem("userObject"));
    return userObject ? userObject.coinsPerTap : 1;
  });
  const [coinsPerSecond, setCoinsPerSecond] = useState(() => {
    const userObject = JSON.parse(localStorage.getItem("userObject"));
    return userObject ? userObject.coinsPerSecond : 0;
  });
  const [lastUpdate, setLastUpdate] = useState(() => {
    const userObject = JSON.parse(localStorage.getItem("userObject"));
    return userObject ? userObject.lastUpdate : Date.now();
  });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!isMounted.current) {
      const touchHandler = (ev) => {
        console.log(ev);
        ev.preventDefault() // Prevent text selection
      }
      document.addEventListener('touchstart', touchHandler, {passive:false})
      document.addEventListener('touchmove', touchHandler, {passive:false})
      // document.addEventListener('touchend', touchHandler, {passive:false})
      document.addEventListener('touchcancel', touchHandler, {passive:false})


      const userObject = JSON.parse(localStorage.getItem("userObject"));

      if (userObject?.lastUpdate) {
        const calculateOfflineEarnings = () => {
          const now = Date.now();
          const timePassed = now - lastUpdate;
          const earnings = Math.floor(timePassed / 1000) * coinsPerSecond;

          if (earnings > 0) {
            setMessages([
              `You've earned ${earnings.toLocaleString(
                "ru-RU"
              )} coins while you were away!`,
            ]);
            setCoins(coins + earnings);
            setLastUpdate(now);
            setTimeout(() => setMessages([]), 5000);
          }
        };

        calculateOfflineEarnings();
      }

      isMounted.current = true;
    }
  }, []);

  // Сохранение данных в localStorage при изменении состояния
  useEffect(() => {
    const updateLocalData = () => {
      const userObject = {
        coins,
        coinsPerTap,
        coinsPerSecond,
        lastUpdate: Date.now(),
      };
      localStorage.setItem("userObject", JSON.stringify(userObject));
    };

    updateLocalData();
  }, [coins, coinsPerTap, coinsPerSecond, lastUpdate]);

  // Увеличение количества монет в секунду
  useEffect(() => {
    if (coinsPerSecond > 0) {
      const interval = setInterval(() => {
        setCoins((prevCoins) => prevCoins + coinsPerSecond);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [coinsPerSecond]);

  const upgradeLevel = () => {
    const upgradePrice = 10 * coinsPerTap;
    if (coins >= upgradePrice) {
      setCoins(coins - upgradePrice);
      setCoinsPerTap(coinsPerTap + 1);
    }
  };

  const upgradeAutoBot = () => {
    const upgradePrice = 20 * coinsPerSecond;
    if (coins >= upgradePrice) {
      setCoins(coins - upgradePrice);
      setCoinsPerSecond(coinsPerSecond + (Math.floor(coinsPerSecond / 2) || 1));
    }
  };

  const earnCoin = () => {
    setCoins(coins + coinsPerTap);
  };

  const perHour = useMemo(() => coinsPerSecond * 3600, [coinsPerSecond]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "2em",
          fontSize: "0.8em",
          textAlign: "left",
          justifyContent: "space-between",
        }}
      >
        <p style={{ margin: 0 }}>
          {coinsPerTap.toLocaleString("ru-RU")} cøins / tap{" "}
        </p>
        {/* <p style={{ margin: 0 }}>{coinsPerSecond} coins / second</p> */}
        <p style={{ margin: 0 }}>
          {perHour.toLocaleString("ru-RU")} cøins / hour
        </p>
      </div>
      <div className="my-coins">
        <h1 className="points">{coins.toLocaleString("ru-RU")}</h1>
        <p
          style={{
            margin: 0,
            fontWeight: 300,
            letterSpacing: "0.05em",
            fontSize: "2em",
            lineHeight: 1,
          }}
        >
          cøins
        </p>
      </div>
      {!!messages.length && (
        <div
          style={{
            backgroundColor: "rgb(255 215 0 / 100%)",
            color: "black",
            borderRadius: "4px",
            padding: "4px 16px",
            margin: "16px 0",
          }}
        >
          {messages.map((message, index) => (
            <p key={index} style={{ margin: 0 }}>
              {message}
            </p>
          ))}
        </div>
      )}

      <button type="button" className="button--xl" onClick={earnCoin} onTouchEnd={earnCoin}></button>

      <br />
      <br />
      <br />

      <div style={{ display: "flex", gap: "1em", justifyContent: "center" }}>
        <button type="button" onClick={upgradeLevel} onTouchEnd={upgradeLevel} >
          Upgrade{" "}
          <span
            style={{
              fontSize: "0.8em",
              fontWeight: 400,
              display: "block",
              whiteSpace: "nowrap",
              marginTop: ".25em",
            }}
          >
            (-{(coinsPerTap * 10).toLocaleString("ru-RU")} cøins)
          </span>
        </button>

        <button type="button" onClick={upgradeAutoBot} onTouchEnd={upgradeAutoBot}>
          Autobot{" "}
          <span
            style={{
              fontSize: "0.8em",
              fontWeight: 400,
              display: "block",
              whiteSpace: "nowrap",
              marginTop: ".25em",
            }}
          >
            (-{((coinsPerSecond || 1) * 20).toLocaleString("ru-RU")} cøins)
          </span>
        </button>
      </div>
    </>
  );
}

export default App;
