import { parseISO } from "date-fns";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";
import Link from "next/link";

import { userPlayer } from "../../contexts/PlayerContext";
import Head from "next/head";

type Episode = {
  id: string;
  url: string;
  title: string;
  members: string;
  duration: number;
  thumbnail: string;
  description: string;
  publishedAt: string;
  durationAsString: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { playlist } = userPlayer();
  return (
    <div className={styles.episode}>
      <Head> <title>{episode.title}</title> </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => playlist([episode], 0)}>
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => ({ params: { slug: episode.id } }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (cxt) => {
  const {
    data: { id, title, thumbnail, members, published_at, file, description },
  } = await api.get(`/episodes/${cxt.params.slug}`);

  const episode = {
    id,
    title,
    members,
    thumbnail,
    description,
    url: file.url,
    duration: Number(file.duration),
    durationAsString: convertDurationToTimeString(Number(file.duration)),
    publishedAt: format(parseISO(published_at), "d MMM yy", { locale: ptBR }),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 8,
  };
};
