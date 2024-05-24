import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  src: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Scale Dogecoin',
    src: require('@site/static/img/scale-doge.png').default,
    description: (
      <>
        ZKP on Dogecoin makes it possible to securely scale doge <b>without increasing the block size</b> or <b>making it more difficult to operate a doge node</b>
      </>
    ),
  },
  {
    title: 'dApps and DeFi on Doge',
    src: require('@site/static/img/defi-doge.png').default,
    description: (
      <>
        With <Link to="/docs/OP_CHECKGROTH16VERIFY">OP_CHECKGROTH16VERIFY</Link> it is possible to build dApps and DeFi on Dogecoin, adding utility to Doge, increasing on chain activity and improving doge miner profitability via increased fees.
      </>
    ),
  },
  {
    title: 'Secured by Doge',
    src: require('@site/static/img/security-doge.png').default,
    description: (
      <>
        City Rollup and other zk rollups built using <Link to="/docs/OP_CHECKGROTH16VERIFY">OP_CHECKGROTH16VERIFY</Link> inherit the full security of Dogecoin using the power of zero knowledge proofs
      </>
    ),
  },
];

function Feature({title, src, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <div className="text--center">
        <img className={styles.featureSvg} src={src} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className={styles.dogeH3}>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
