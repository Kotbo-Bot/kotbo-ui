<script lang="ts">
  import {
    ActionButton,
    AmountRangeSlider,
    Breadcrumbs,
    Button,
    Calendar,
    Callout,
    ConfirmModal,
    DetailSheet,
    EmptyState,
    Field,
    FilterPills,
    FormColorPicker,
    FormInput,
    FormSelect,
    FormTextarea,
    InlineFeedback,
    Menu,
    Modal,
    MultiSelect,
    RefreshButton,
    SearchableSelect,
    SectionCard,
    SettingsGroup,
    SettingsRow,
    Skeleton,
    StatTile,
    Tabs,
    ToggleSwitch,
    UnsavedChangesBar,
    toast,
    type CalendarEvent,
    type CalendarView,
  } from '#lib';
  import {
    AnalyticsChartCard,
    AnalyticsSkeleton,
    BarList,
    CohortTable,
    KpiTile,
    ShareBar,
    Sparkline,
    TopList,
    TrendChart,
    SERIES,
    fmtNumber,
  } from '#lib/analytics';

  let dark = $state(false);
  let activeTab = $state('analytics');

  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
  }

  // Analytics demo data
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 10, 14 + i));
    return d.toISOString().slice(0, 10);
  });
  const labels = dates.map((d) => d.slice(5));

  let activeMetric = $state('messages');
  let period = $state('day');
  let compare = $state(true);

  const metrics = [
    {
      id: 'messages',
      label: 'Messages analysés',
      value: '24 890',
      delta: 14.2,
      spark: [1240, 1420, 1380, 1590, 1710, 1680, 1890, 2010, 1940, 2120, 2240, 2190, 2380, 2510],
      values: [1240, 1420, 1380, 1590, 1710, 1680, 1890, 2010, 1940, 2120, 2240, 2190, 2380, 2510],
      previousValues: [1100, 1180, 1210, 1320, 1400, 1390, 1510, 1600, 1580, 1710, 1780, 1790, 1850, 1920],
      color: 'var(--series-1)',
      aggregate: 'sum' as const,
      format: (v: number) => `${fmtNumber(v)} msg`,
    },
    {
      id: 'accuracy',
      label: 'Précision IA',
      value: '96,4 %',
      delta: 1.8,
      spark: [94.1, 94.5, 94.3, 95.0, 95.2, 95.5, 95.8, 95.6, 96.0, 96.1, 96.3, 96.2, 96.5, 96.4],
      values: [94.1, 94.5, 94.3, 95.0, 95.2, 95.5, 95.8, 95.6, 96.0, 96.1, 96.3, 96.2, 96.5, 96.4],
      previousValues: [92.8, 93.1, 93.0, 93.4, 93.8, 94.0, 94.1, 94.2, 94.5, 94.4, 94.6, 94.7, 94.8, 94.6],
      color: 'var(--series-3)',
      aggregate: 'avg' as const,
      format: (v: number) => `${v.toFixed(1)} %`,
    },
    {
      id: 'toxicity',
      label: 'Taux de toxicité',
      value: '2,1 %',
      delta: -0.7,
      invert: true,
      spark: [3.2, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.4, 2.3, 2.2, 2.2, 2.1, 2.1],
      values: [3.2, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.4, 2.3, 2.2, 2.2, 2.1, 2.1],
      previousValues: [3.5, 3.4, 3.3, 3.2, 3.1, 3.1, 3.0, 2.9, 2.9, 2.8, 2.8, 2.8, 2.8, 2.8],
      color: 'var(--series-8)',
      aggregate: 'avg' as const,
      format: (v: number) => `${v.toFixed(1)} %`,
    },
  ];

  // UI interactive demo state
  let filterVal = $state('all');
  let switchChecked = $state(true);
  let modalOpen = $state(false);
  let confirmOpen = $state(false);
  let sheetOpen = $state(false);
  let sheetTab = $state('overview');
  let singleSelect = $state<string | null>('general');
  let multiSelect = $state<string[]>(['mod', 'events']);
  let inputVal = $state('Salon principal');
  let selectVal = $state('fr');
  let textareaVal = $state('Message de bienvenue personnalisé');
  let colorVal = $state('#1f8f4e');
  let rangeMin = $state(50);
  let rangeMax = $state(500);
  let unsavedVisible = $state(false);
  let calView = $state<CalendarView>('week');
  let calDate = $state(new Date());

  const calEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Réunion équipe modération',
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(11, 30, 0, 0)),
      type: 'meeting',
      staffName: 'Elouan',
    },
    {
      id: '2',
      title: 'Revue Analytics v3',
      start: new Date(new Date().setHours(14, 0, 0, 0)),
      end: new Date(new Date().setHours(15, 0, 0, 0)),
      type: 'task',
      staffName: 'Kotbo',
    },
  ];
</script>

<div class="showcase">
  <header class="showcase__header">
    <div>
      <h1 class="showcase__title">@kotbo/ui — Showcase</h1>
      <p class="showcase__subtitle">Analytics v3 & primitives UI partagées (Sand / Night, zéro Tailwind)</p>
    </div>
    <div class="showcase__header-actions">
      <Button variant="secondary" icon={dark ? 'sun' : 'moon'} onclick={toggleTheme}>
        {dark ? 'Thème clair' : 'Thème sombre'}
      </Button>
      <Button variant="primary" icon="bell" onclick={() => toast.success('Toast de démonstration affiché !')}>
        Tester Toast
      </Button>
    </div>
  </header>

  <Tabs
    label="Sections du showcase"
    active={activeTab}
    onchange={(id) => (activeTab = id)}
    tabs={[
      { id: 'analytics', label: 'Analytics v3', icon: 'bar-chart-2' },
      { id: 'ui', label: 'Primitives UI', icon: 'layers', badge: 13 },
      { id: 'forms', label: 'Formulaires & Calendrier', icon: 'calendar' },
    ]}
  />

  {#if activeTab === 'analytics'}
    <div class="showcase__stack">
      <AnalyticsChartCard
        {metrics}
        bind:active={activeMetric}
        {labels}
        periodOptions={[
          { value: 'day', label: 'Jour (14j)' },
          { value: 'week', label: 'Semaine' },
          { value: 'month', label: 'Mois' },
        ]}
        {period}
        onPeriodChange={(p: string) => (period = p)}
        {compare}
        onToggleCompare={() => (compare = !compare)}
      />

      <div class="showcase__grid-3">
        <KpiTile label="Utilisateurs actifs" value="3 412" delta={8.4} compare />
        <KpiTile label="Temps de réponse" value="142 ms" delta={-12.5} invert compare />
        <KpiTile label="Taux de rétention" value="78,2 pts" delta={3.1} unit="pts" compare />
      </div>

      <div class="showcase__grid-2">
        <SectionCard title="BarList & ShareBar" description="Répartition proportionnelle et légende">
          <div class="showcase__stack-sm">
            <ShareBar
              segments={[
                { id: 'text', label: 'Messages texte', value: 6420, color: SERIES[0] },
                { id: 'voice', label: 'Vocal', value: 2150, color: SERIES[2] },
                { id: 'cmd', label: 'Commandes', value: 980, color: SERIES[3] },
              ]}
              showCounts
            />
            <BarList
              items={[
                { id: 'g', label: '#général', value: 4210, sub: '128 membres' },
                { id: 'a', label: '#entraide', value: 2840, sub: '74 membres' },
                { id: 'm', label: '#médias', value: 1120, sub: '39 membres' },
              ]}
            />
          </div>
        </SectionCard>

        <TopList
          title="Top salons"
          description="Activité sur la période"
          icon="hash"
          entityLabel="Salon"
          items={[
            { id: '1', name: '#général', value: 4210, previous: 3820, spark: [12, 18, 15, 22, 26] },
            { id: '2', name: '#entraide', value: 2840, previous: 2910, spark: [14, 13, 16, 15, 14] },
            { id: '3', name: '#annonces', value: 980, previous: 740, spark: [4, 6, 5, 9, 11] },
          ]}
          total={8030}
          prevTotal={7470}
          compare
        />
      </div>

      <div class="showcase__grid-2">
        <SectionCard title="TrendChart & Sparkline">
          <div class="showcase__stack-sm">
            <div style="display:flex;align-items:center;gap:1rem;">
              <span>Tendance rapide :</span>
              <Sparkline values={[4, 9, 7, 14, 12, 19, 24]} width={120} height={28} />
            </div>
            <TrendChart
              dates={dates.slice(0, 7)}
              values={[120, 145, 132, 180, 165, 210, 195]}
              previous={[100, 110, 125, 130, 140, 155, 160]}
              label="Messages"
              previousLabel="Semaine préc."
              compare
            />
          </div>
        </SectionCard>

        <CohortTable
          title="Rétention hebdomadaire"
          description="Part des nouveaux membres encore actifs"
          weeks={4}
          cohorts={[
            { week: '2026-10-05', size: 120, retention: [100, 62, 48, 41] },
            { week: '2026-10-12', size: 95, retention: [100, 68, 52, null] },
            { week: '2026-10-19', size: 140, retention: [100, 71, null, null] },
          ]}
        />
      </div>

      <SectionCard title="AnalyticsSkeleton (compact)">
        <AnalyticsSkeleton compact rows={3} />
      </SectionCard>
    </div>
  {:else if activeTab === 'ui'}
    <div class="showcase__stack">
      <Breadcrumbs items={[{ label: 'Accueil', href: '#' }, { label: '@kotbo/ui', href: '#' }, { label: 'Primitives UI' }]} />

      <SectionCard title="Boutons, Pastilles & Callouts" icon="sparkles">
        <div class="showcase__stack-sm">
          <div class="showcase__row">
            <Button variant="primary" icon="plus">Action principale</Button>
            <Button variant="secondary" icon="settings">Secondaire</Button>
            <Button variant="ghost">Discret</Button>
            <Button variant="danger" icon="trash">Supprimer</Button>
            <Button variant="primary" loading>Chargement</Button>
            <Button variant="primary" disabled disabledReason="Choisis d'abord une option">Désactivé expliqué</Button>
            <ActionButton variant="neutral" label="ActionButton" />
            <RefreshButton onclick={() => toast.info('Rafraîchi !')} />
            <Menu
              label="Actions"
              items={[
                { label: 'Dupliquer', description: 'Crée une copie', icon: 'copy', onselect: () => toast.info('Copié') },
                { label: 'Archiver', icon: 'archive', onselect: () => toast.warning('Archivé') },
              ]}
            />
          </div>

          <FilterPills
            label="Filtre"
            value={filterVal}
            onchange={(v) => (filterVal = v)}
            options={[
              { value: 'all', label: 'Tous', count: 42 },
              { value: 'active', label: 'Actifs', count: 18 },
              { value: 'archived', label: 'Archives', count: 24 },
            ]}
          />

          <div class="showcase__grid-2">
            <Callout variant="info" title="Information">Module prêt à être configuré.</Callout>
            <Callout variant="warning" title="Attention">Vérifiez les permissions avant publication.</Callout>
          </div>
        </div>
      </SectionCard>

      <div class="showcase__grid-3">
        <StatTile icon="users" variant="primary" value="1 284" label="Membres vérifiés" />
        <StatTile icon="check-circle" variant="success" value="99,4 %" label="Disponibilité" />
        <StatTile icon="alert-triangle" variant="danger" value="12" label="Alertes actives" />
      </div>

      <SettingsGroup title="Paramètres" description="SettingsGroup + SettingsRow + ToggleSwitch">
        <SectionCard flush>
          <SettingsRow label="Activer la détection automatique" description="Analyse les messages en temps réel." labelFor="sw-demo">
            <ToggleSwitch id="sw-demo" checked={switchChecked} onToggle={(v) => (switchChecked = v)} />
          </SettingsRow>
        </SectionCard>
      </SettingsGroup>

      <SectionCard title="Overlays & États" icon="layers">
        <div class="showcase__row">
          <Button variant="secondary" onclick={() => (modalOpen = true)}>Ouvrir Modal</Button>
          <Button variant="danger" onclick={() => (confirmOpen = true)}>Ouvrir ConfirmModal</Button>
          <Button variant="secondary" onclick={() => (sheetOpen = true)}>Ouvrir DetailSheet</Button>
          <Button variant="secondary" onclick={() => (unsavedVisible = !unsavedVisible)}>
            {unsavedVisible ? 'Masquer barre modifs' : 'Afficher barre modifs'}
          </Button>
        </div>
        <div style="margin-top: 1rem;">
          <Skeleton width="100%" height="1.25rem" />
        </div>
        <EmptyState
          title="Aucun élément sélectionné"
          description="Utilisez les boutons ci-dessus pour ouvrir une modale ou une fiche détaillée."
          reason="instruction"
        />
      </SectionCard>
    </div>
  {:else}
    <div class="showcase__stack">
      <SectionCard title="Champs & Sélecteurs" icon="sliders">
        <div class="showcase__grid-2">
          <Field label="Nom du salon" hint="Affiché dans les journaux">
            {#snippet children(id, describedBy)}
              <FormInput {id} aria-describedby={describedBy} bind:value={inputVal} />
            {/snippet}
          </Field>

          <Field label="Langue">
            {#snippet children(id, describedBy)}
              <FormSelect {id} aria-describedby={describedBy} bind:value={selectVal}>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </FormSelect>
            {/snippet}
          </Field>

          <Field label="SearchableSelect">
            {#snippet children(id, describedBy)}
              <SearchableSelect
                {id}
                {describedBy}
                bind:value={singleSelect}
                options={[
                  { id: 'general', name: 'Général', icon: 'hash' },
                  { id: 'support', name: 'Support', color: '#1baf7a' },
                  { id: 'logs', name: 'Logs IA', color: '#2a78d6' },
                ]}
              />
            {/snippet}
          </Field>

          <Field label="MultiSelect">
            {#snippet children(id, describedBy)}
              <MultiSelect
                {id}
                {describedBy}
                bind:values={multiSelect}
                options={[
                  { id: 'mod', name: 'Modération' },
                  { id: 'events', name: 'Événements' },
                  { id: 'vip', name: 'VIP' },
                ]}
              />
            {/snippet}
          </Field>

          <Field label="Couleur">
            <FormColorPicker bind:value={colorVal} />
          </Field>

          <Field label="Fourchette ({rangeMin} – {rangeMax})">
            <AmountRangeSlider
              range={{ min: 10, max: 1000 }}
              bind:min={rangeMin}
              bind:max={rangeMax}
              labelMin="Minimum"
              labelMax="Maximum"
              labelRange="Fourchette"
            />
          </Field>
        </div>

        <div style="margin-top: 1rem;">
          <Field label="Description">
            {#snippet children(id, describedBy)}
              <FormTextarea {id} aria-describedby={describedBy} bind:value={textareaVal} rows={2} />
            {/snippet}
          </Field>
          <div style="margin-top: 0.5rem;">
            <InlineFeedback message="Saisie valide" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Calendrier" flush>
        <div style="height: 480px;">
          <Calendar
            bind:view={calView}
            bind:currentDate={calDate}
            events={calEvents}
            onRangeChange={() => {}}
            onEventClick={(ev) => toast.info(ev.title)}
            onSlotSelect={(start) => toast.info(`Créneau : ${start.toLocaleTimeString()}`)}
          />
        </div>
      </SectionCard>
    </div>
  {/if}
</div>

<Modal bind:open={modalOpen} title="Exemple de modale" subtitle="Focus piégé et fermeture par Échap">
  <p style="margin:0;">Contenu de la fenêtre modale autonome @kotbo/ui.</p>
  {#snippet footer()}
    <div style="display:flex;justify-content:flex-end;gap:0.5rem;">
      <Button variant="ghost" onclick={() => (modalOpen = false)}>Fermer</Button>
      <Button variant="primary" onclick={() => (modalOpen = false)}>Valider</Button>
    </div>
  {/snippet}
</Modal>

<ConfirmModal
  bind:open={confirmOpen}
  variant="danger"
  title="Confirmer la suppression ?"
  description="Cette action est irréversible."
  impacts={['Supprime les statistiques associées']}
  onConfirm={() => toast.success('Confirmé !')}
/>

<DetailSheet
  open={sheetOpen}
  onClose={() => (sheetOpen = false)}
  icon="layers"
  title="Fiche détaillée"
  subtitle="Démonstration DetailSheet"
  tabs={[
    { id: 'overview', label: 'Vue générale' },
    { id: 'history', label: 'Historique', badge: 4 },
  ]}
  active={sheetTab}
  onchange={(t) => (sheetTab = t)}
>
  <p>Onglet actif : <strong>{sheetTab}</strong></p>
</DetailSheet>

<UnsavedChangesBar
  visible={unsavedVisible}
  subtitle="Page de démonstration"
  onReset={() => {
    unsavedVisible = false;
    toast.info('Modifications annulées');
  }}
  onSave={() => {
    unsavedVisible = false;
    toast.success('Modifications enregistrées');
  }}
/>

<style>
  .showcase {
    max-width: 1120px;
    margin: 0 auto;
    padding: 2rem 1.25rem 5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .showcase__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .showcase__title {
    margin: 0;
    font-family: var(--font-headline);
    font-size: 1.75rem;
  }

  .showcase__subtitle {
    margin: 0.25rem 0 0;
    color: var(--on-surface-variant);
    font-size: 0.875rem;
  }

  .showcase__header-actions,
  .showcase__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.625rem;
  }

  .showcase__stack {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .showcase__stack-sm {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .showcase__grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
    gap: 1rem;
  }

  .showcase__grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1rem;
  }
</style>
