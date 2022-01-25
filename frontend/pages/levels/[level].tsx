import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import type { LevelDetails } from '../../types';

const Level: NextPage<{ level: LevelDetails }> = ({ level }) => {
    return (
        <div>
            <div>{level.id}</div>
            <div>{level.title}</div>
            <div>{level.description}</div>
            <div>{level.hint}</div>
            <div>{level.question}</div>
        </div>
    );
};

export const getStaticProps: GetStaticProps<any, { level: string }> = async context => {
    const levelDetails: LevelDetails = await (
        await fetch(`http://localhost:8000/levels/${context.params?.level}`)
    ).json();

    return { props: { level: levelDetails ?? 'oh noes' } };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const numLevels: number = (await (await fetch('http://localhost:8000/levels/all')).json()).length;

    const paths = Array(numLevels)
        .fill(0)
        .map((_, index) => {
            return {
                params: { level: `${index}` },
            };
        });

    return {
        paths,
        fallback: false,
    };
};

export default Level;
