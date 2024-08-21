import React from "react";
import styles from "./page.module.css";

import Table from "./components/Table";
import { getQuests } from "@/actions/quests";

export default async function AdminPage() {
  return (
    <>
      <section className={styles.section}>
        <a className={styles.linkTitle} href="/admin/quest/all">quêtes</a>
        <Table data={await getQuests(10)} />
      </section>
    </>
  );
}
