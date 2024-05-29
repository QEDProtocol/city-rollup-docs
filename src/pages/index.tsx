import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import DogeBackground from '../components/doge-background';
import BrowserOnly from '@docusaurus/BrowserOnly';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.dogeBgCon}>
        <BrowserOnly>
          {() => <DogeBackground words={["zkp", "groth16", "trustless", "scalability", "rollup", "dogecoin", "op code"]} />}
        </BrowserOnly>
      </div>
      <div className={styles.heroInner}>
        <div className={styles.headerImageCon}>
          <img src={require('@site/static/img/city-rollup-logo.png').default} alt="City Rollup" className={styles.headerImage} />
        </div>
        <div className={styles.headerInfo}>
          <p className={styles.headerText}>a proof of concept zk rollup on dogecoin</p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/tutorial/getting_started">
              Run City Rollup Locally
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`city rollup: a trustless rollup that makes doge stronk`}
      description="OP_CHECKGROTH16VERIFY makes the doge stronk">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
