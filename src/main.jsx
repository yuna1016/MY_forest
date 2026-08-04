import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Droplets, ExternalLink, Sun } from "lucide-react";
import "./index.css";

const siteIllustrations = import.meta.glob(
  [
    "../assets/site-illustrations/**/*.png",
    "!../assets/site-illustrations/**/*source-alpha.png",
  ],
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

const asset = (path) => siteIllustrations[`../assets/site-illustrations/${path}`];

const introAssets = {
  land: asset("intro/land.png"),
  seedling: asset("intro/seedling.png"),
  wateringCan: asset("intro/watering-can.png"),
  waterArc: asset("intro/water-arc.png"),
};

const treeAssets = {
  trunk: asset("tree/trunk.png"),
  branchUpper: asset("tree/branch-upper.png"),
  branchLower: asset("tree/branch-lower.png"),
  leafRoot: asset("tree/leaf-root.png"),
  leafBranches: asset("tree/leaf-branches.png"),
  leafVibes: asset("tree/leaf-vibes.png"),
  leafSmallA: asset("tree/leaf-small-a.png"),
  leafSmallB: asset("tree/leaf-small-b.png"),
};

const puffAssets = {
  sitting: asset("puff/puff-sitting-branch.png"),
  avatar: asset("puff/puff-avatar.png"),
};

const titleAssets = {
  about: asset("titles/about-me.png"),
  roots: asset("titles/my-roots.png"),
  branches: asset("titles/my-branches.png"),
  vibes: asset("titles/my-vibes.png"),
};

const vibeCovers = [
  asset("vibes/vibe-ai-notes.png"),
  asset("vibes/vibe-design-lab.png"),
  asset("vibes/vibe-side-projects.png"),
];

const content = {
  about: {
    name: "【填】",
    detail:
      "这里可以放一段 2-3 句的自我介绍：你正在关注什么、擅长什么、喜欢怎样把想法落到真实作品里。",
  },
  roots: [
    { label: "学校", value: "【填】" },
    { label: "专业", value: "【填】" },
    { label: "时间", value: "【填】" },
  ],
  branches: [
    {
      company: "【公司】",
      role: "【职位】",
      time: "【时间】",
      note: "【一句话职责】",
    },
    {
      company: "【公司】",
      role: "【职位】",
      time: "【时间】",
      note: "【一句话职责】",
    },
  ],
  vibes: [
    {
      title: "【项目名】",
      desc: "【一句话简介】",
      href: "#",
      cover: vibeCovers[0],
    },
    {
      title: "【项目名】",
      desc: "【一句话简介】",
      href: "#",
      cover: vibeCovers[1],
    },
    {
      title: "【项目名】",
      desc: "【一句话简介】",
      href: "#",
      cover: vibeCovers[2],
    },
  ],
};

const introExit = {
  hidden: {
    opacity: 0,
    y: -24,
    scale: 0.985,
    transition: { duration: 0.38, ease: "easeOut" },
  },
};

const treeContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.24,
      delayChildren: 0.1,
    },
  },
};

const branchGroupVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const leafGroupVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const trunkVariant = {
  hidden: { opacity: 0, y: 28, scaleY: 0.78 },
  show: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.72, ease: "easeOut" },
  },
};

const branchVariant = {
  hidden: { opacity: 0, scaleX: 0.08 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.74, ease: "easeOut" },
  },
};

const leafVariant = {
  hidden: { opacity: 0, scale: 0.72, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.46, ease: "easeOut" },
  },
};

const puffVariant = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main className="min-h-screen bg-milk text-ink">
      <AnimatePresence mode="wait">
        {!introDone ? (
          <IntroScene key="intro" onDone={() => setIntroDone(true)} />
        ) : (
          <ProfilePage key="profile" />
        )}
      </AnimatePresence>
    </main>
  );
}

function IntroScene({ onDone }) {
  const [stage, setStage] = useState("idle");
  const watering = stage !== "idle";

  useEffect(() => {
    if (stage !== "pouring") return undefined;

    const growTimer = window.setTimeout(() => setStage("growing"), 680);

    return () => window.clearTimeout(growTimer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "growing") return undefined;

    const doneTimer = window.setTimeout(onDone, 1120);

    return () => window.clearTimeout(doneTimer);
  }, [stage, onDone]);

  const startWatering = () => {
    if (watering) return;
    setStage("pouring");
  };

  return (
    <motion.section
      className={`intro-screen${watering ? " is-watering" : ""}`}
      exit={introExit.hidden}
      aria-labelledby="intro-title"
      onClick={startWatering}
    >
      <button
        className="skip-button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDone();
        }}
      >
        跳过
      </button>

      <motion.div
        className="intro-sun"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, 3, 0] }}
        transition={{
          opacity: { duration: 0.45, ease: "easeOut" },
          scale: { duration: 0.45, ease: "easeOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Sun size={88} strokeWidth={3.2} />
      </motion.div>

      <div className="intro-center">
        <motion.div
          className="intro-illustration"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.img
            className="intro-can"
            src={introAssets.wateringCan}
            alt=""
            draggable="false"
            animate={
              stage === "idle"
                ? { rotate: 0, x: 0, y: 0, opacity: 0.95 }
                : stage === "pouring"
                  ? { rotate: 18, x: 14, y: 8, opacity: 1 }
                  : { rotate: 18, x: 26, y: 12, opacity: 0 }
            }
            transition={{ duration: stage === "growing" ? 0.28 : 0.48, ease: "easeOut" }}
          />
          <motion.img
            className="intro-water"
            src={introAssets.waterArc}
            alt=""
            draggable="false"
            initial={false}
            animate={
              stage === "pouring"
                ? {
                    opacity: [0, 1, 0.9, 0],
                    x: [0, 0, -4, -8],
                    y: [0, 3, 9, 16],
                    rotate: -71,
                    scaleX: 1,
                  }
                : { opacity: 0, x: 0, y: 0, rotate: -71, scaleX: 1 }
            }
            transition={{
              duration: 0.78,
              ease: "easeOut",
              times: [0, 0.12, 0.68, 1],
            }}
          />
          <motion.div
            className="intro-grown-tree"
            aria-hidden="true"
            initial={false}
            animate={
              stage === "growing"
                ? { opacity: 1, scaleY: 1, y: -4 }
                : { opacity: 0, scaleY: 0.2, y: 84 }
            }
            transition={{ duration: 1.02, ease: "easeOut" }}
          >
            <img className="intro-grow-trunk" src={treeAssets.trunk} alt="" />
            <img className="intro-grow-branch" src={treeAssets.branchUpper} alt="" />
            <img className="intro-grow-leaf one" src={treeAssets.leafSmallA} alt="" />
            <img className="intro-grow-leaf two" src={treeAssets.leafSmallB} alt="" />
          </motion.div>
          <motion.img
            className="intro-seedling"
            src={introAssets.seedling}
            alt=""
            draggable="false"
            animate={
              stage === "idle"
                ? { scale: 1, y: 0, opacity: 1 }
                : stage === "pouring"
                  ? { scale: [1, 1.05, 1], y: [0, 3, 0], opacity: 1 }
                  : { scale: 1.18, y: -22, opacity: 0 }
            }
            transition={{
              duration: stage === "pouring" ? 0.64 : 0.42,
              ease: "easeOut",
            }}
          />
          <img
            className="intro-land"
            src={introAssets.land}
            alt=""
            draggable="false"
          />
        </motion.div>
      </div>

      <motion.button
        className="water-button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          startWatering();
        }}
        disabled={watering}
        aria-describedby="intro-title"
        animate={watering ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        whileHover={watering ? undefined : { y: -3, rotate: -0.8 }}
        whileTap={watering ? undefined : { y: 1, scale: 0.985 }}
        transition={{ duration: 0.26, ease: "easeOut" }}
      >
        <span className="water-icon" aria-hidden="true">
          <Droplets size={23} />
        </span>
        <span id="intro-title">浇一点水</span>
      </motion.button>
    </motion.section>
  );
}

function ProfilePage() {
  const gardenRef = useRef(null);

  useLayoutEffect(() => {
    const garden = gardenRef.current;
    if (!garden) return undefined;

    const contentStack = garden.querySelector(".content-stack");
    const rows = [...garden.querySelectorAll(".section-row")];
    if (!contentStack || rows.length < 3) return undefined;

    const syncTreeAnchors = () => {
      const gardenTop = garden.getBoundingClientRect().top;
      const middleRowTop = rows[1].getBoundingClientRect().top - gardenTop;
      const lowerRowTop = rows[2].getBoundingClientRect().top - gardenTop;

      garden.style.setProperty(
        "--middle-branch-top",
        `${Math.max(150, middleRowTop - 44)}px`,
      );
      garden.style.setProperty(
        "--lower-branch-top",
        `${Math.max(520, lowerRowTop + 17)}px`,
      );
    };

    const observer = new ResizeObserver(syncTreeAnchors);
    observer.observe(contentStack);
    rows.forEach((row) => observer.observe(row));
    syncTreeAnchors();

    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      className="profile-page"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.58, ease: "easeOut" }}
      aria-label="个人主页"
    >
      <AboutBanner />

      <div className="garden-layout" ref={gardenRef}>
        <TreeAxis />
        <div className="content-stack">
          <ContentSection
            title={titleAssets.roots}
            titleLabel="My Roots"
            connectorLeaf={treeAssets.leafRoot}
            connectorDelay={1.18}
          >
            <dl className="roots-list">
              {content.roots.map((item, index) => (
                <div className="roots-item" key={item.label}>
                  <span className="root-knot" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </ContentSection>

          <ContentSection
            title={titleAssets.branches}
            titleLabel="My Branches"
            connectorLeaf={treeAssets.leafBranches}
            connectorDelay={1.3}
          >
            <div className="branches-list">
              {content.branches.map((item, index) => (
                <article className="branch-entry" key={`${item.company}-${index}`}>
                  <div>
                    <h3>{item.company}</h3>
                    <p>{item.role}</p>
                  </div>
                  <time>{item.time}</time>
                  <p className="branch-note">{item.note}</p>
                </article>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            title={titleAssets.vibes}
            titleLabel="My Vibes"
            connectorLeaf={treeAssets.leafVibes}
            connectorDelay={1.42}
          >
            <div className="vibes-grid">
              {content.vibes.map((item, index) => (
                <a className="vibe-card" href={item.href} key={`${item.title}-${index}`}>
                  <img src={item.cover} alt="" draggable="false" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <ExternalLink size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </ContentSection>
        </div>
      </div>
    </motion.section>
  );
}

function AboutBanner() {
  return (
    <header className="about-banner">
      <div className="about-copy">
        <h1 className="sr-only">About me</h1>
        <img className="title-image about-title" src={titleAssets.about} alt="" />
        <div className="about-text-grid">
          <p className="about-name">{content.about.name}</p>
          <p className="about-line">{content.about.line}</p>
        </div>
      </div>
      <div className="avatar-frame">
        <img src={puffAssets.avatar} alt="Puff 头像占位插画" draggable="false" />
      </div>
      <p className="about-detail about-detail-wide">{content.about.detail}</p>
    </header>
  );
}

function TreeAxis() {
  const leafMotions = useMemo(
    () => [
      { y: [0, -3, 0], rotate: [-2, 1, -2], duration: 6.6 },
      { y: [0, 3, 0], rotate: [2, -1, 2], duration: 7.2 },
      { y: [0, -2, 0], rotate: [-1, 2, -1], duration: 6.9 },
      { y: [0, 2, 0], rotate: [1, -2, 1], duration: 7.6 },
    ],
    [],
  );

  return (
    <aside className="tree-column" aria-hidden="true">
      <motion.div
        className="tree-stage"
        variants={treeContainer}
        initial="hidden"
        animate="show"
      >
        <motion.img
          className="tree-part trunk"
          src={treeAssets.trunk}
          alt=""
          variants={trunkVariant}
          draggable="false"
        />
        <motion.div
          className="tree-layer"
          variants={branchGroupVariant}
        >
          <motion.img
            className="tree-part puff-branch-base"
            src={puffAssets.sitting}
            alt=""
            variants={branchVariant}
            draggable="false"
          />
          <motion.img
            className="tree-part branch branch-upper"
            src={treeAssets.branchUpper}
            alt=""
            variants={branchVariant}
            draggable="false"
          />
          <motion.img
            className="tree-part branch branch-lower"
            src={treeAssets.branchLower}
            alt=""
            variants={branchVariant}
            draggable="false"
          />
        </motion.div>
        <motion.div className="tree-layer" variants={leafGroupVariant}>
          {[
            { src: treeAssets.leafSmallA, className: "leaf-small-1" },
            { src: treeAssets.leafSmallB, className: "leaf-small-2" },
          ].map((leaf, index) => (
            <motion.div
              className={`tree-leaf ${leaf.className}`}
              variants={leafVariant}
              key={leaf.src}
            >
              <motion.img
                src={leaf.src}
                alt=""
                draggable="false"
                animate={{ y: leafMotions[index].y, rotate: leafMotions[index].rotate }}
                transition={{
                  duration: leafMotions[index].duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.img
          className="puff-sitting"
          src={puffAssets.sitting}
          alt=""
          variants={puffVariant}
          draggable="false"
        />
      </motion.div>

      <motion.div
        className="mobile-tree-strip"
        variants={puffVariant}
        initial="hidden"
        animate="show"
      >
        <img className="mobile-puff" src={puffAssets.sitting} alt="" draggable="false" />
      </motion.div>
    </aside>
  );
}

function ContentSection({
  title,
  titleLabel,
  connectorLeaf,
  connectorDelay,
  children,
}) {
  return (
    <section className="section-row">
      <motion.div
        className="connector"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.86, y: 7 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.44, delay: connectorDelay, ease: "easeOut" }}
      >
        <motion.div
          className="connector-drift"
          animate={{ y: [0, -2, 0], rotate: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={connectorLeaf} alt="" draggable="false" />
          <svg viewBox="0 0 180 64" preserveAspectRatio="none">
            <path
              d="M4 34 C45 14 88 53 176 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="7 9"
            />
          </svg>
        </motion.div>
      </motion.div>
      <article className="content-block">
        <h2 className="sr-only">{titleLabel}</h2>
        <img className="title-image" src={title} alt="" draggable="false" />
        {children}
      </article>
    </section>
  );
}

createRoot(document.getElementById("root")).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>,
);
