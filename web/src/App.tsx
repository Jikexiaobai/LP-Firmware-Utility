import React, { useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { useObserver } from "mobx-react-lite";
import { autorun } from "mobx";

import { headers } from "./routes";
import Firmware from "./routes/Firmware";
import Palette from "./routes/Palette";

import { useStore } from "./hooks";

import "./App.css";
import Header from "./components/Header";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Notice from "./components/Notice";
import Modes from "./routes/Modes";

const TransitionRoute = ({ component: Component, ...props }: any) => (
  <Route exact path={props.path}>
    {({ match }) => (
      <CSSTransition
        in={match != null}
        timeout={300}
        classNames="fall"
        unmountOnExit
      >
        <Component />
      </CSSTransition>
    )}
  </Route>
);

const App = () => {
  const wasmStore = useStore(({ wasm }) => wasm);
  const noticeStore = useStore(({ notice }) => notice);
  const history = useHistory();

  useEffect(
    () =>
      autorun(() => {
        if (wasmStore.available === undefined)
          noticeStore.show({
            text: "加载中...(请在1~2秒后刷新该页面)",
            showProgress: true,
            dismissable: false,
          });
        else if (wasmStore.available === true) noticeStore.hide();
        else
          noticeStore.show({
            text: "请使用支持 WebAssembly 的浏览器（例如(最新版):Chrome浏览器、QQ浏览器）",
          });
      }),
    [noticeStore, wasmStore.available]
  );

  if (!Object.keys(headers).includes(history.location.pathname.slice(1)))
    history.push("/firmware");

  return useObserver(() => (
    <div className="w-screen h-screen flex flex-col items-center overflow-hidden">
      <Header disabled={noticeStore.state.visible} />
      <div className="w-full h-full relative">
        <SwitchTransition mode="out-in">
          <CSSTransition
            classNames="fade"
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            key={noticeStore.state.visible.toString()}
          >
            {noticeStore.state.visible ? (
              <Notice />
            ) : (
              <>
                <TransitionRoute path="/firmware" component={Firmware} />
                <TransitionRoute path="/palette" component={Palette} />
                <TransitionRoute path="/modes" component={Modes} />
              </>
            )}
          </CSSTransition>
        </SwitchTransition>
        <span className="w-full bottom-0 pb-2 text-center absolute">
          <span className="opacity-25">
            由 Brendonovich & mat1jaczyyy 编写©{" "}
          </span>
          <a
            href="https://dongyansong.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-75 underline"
          >
            董岩松博客赞助
          </a>
        </span>
      </div>
    </div>
  ));
};

export default App;
