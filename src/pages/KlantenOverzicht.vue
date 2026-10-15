<template>
  <SColumn :gutter="24" class="klanten-overzicht">
    <SRow justify="between" align="center">
      <SHeading :level="1">Klanten</SHeading>
      <SButton variant="primary">Nieuwe klant</SButton>
    </SRow>

    <SRow :gutter="12" align="center">
      <SText>Status</SText>
      <SDropdownV2 v-model="statusFilter" :options="statusOptions" placeholder="Alle klanten" />
    </SRow>

    <SColumn :gutter="12">
      <SCard v-for="klant in zichtbareKlanten" :key="klant.id" :title="klant.naam">
        <SRow justify="between" align="center">
          <SColumn :gutter="4">
            <SText>{{ klant.plaats }}</SText>
            <span :style="{ color: klant.actief ? '#2e7d32' : '#9e9e9e', fontWeight: 600 }">
              {{ klant.actief ? 'Actief' : 'Inactief' }}
            </span>
          </SColumn>
          <SRow :gutter="8">
            <SIcon name="pencil" label="Bewerken" />
            <SIcon name="trash" label="Verwijderen" />
          </SRow>
        </SRow>
      </SCard>
    </SColumn>
  </SColumn>
</template>

<script setup>
import { computed, ref } from 'vue'
import SButton from '../components/SButton.vue'
import SCard from '../components/SCard.vue'
import SColumn from '../components/SColumn.vue'
import SDropdownV2 from '../components/SDropdownV2.vue'
import SHeading from '../components/SHeading.vue'
import SIcon from '../components/SIcon.vue'
import SRow from '../components/SRow.vue'
import SText from '../components/SText.vue'

const klanten = [
  { id: 1, naam: 'Bakkerij De Gouden Korst', plaats: 'Utrecht', actief: true },
  { id: 2, naam: 'Fietsenmaker Van Dijk', plaats: 'Zwolle', actief: false },
  { id: 3, naam: 'Studio Noord', plaats: 'Groningen', actief: true },
  { id: 4, naam: 'Tuincentrum Het Groene Hart', plaats: 'Gouda', actief: true }
]

const statusOptions = [
  { label: 'Alle klanten', value: '' },
  { label: 'Actief', value: 'actief' },
  { label: 'Inactief', value: 'inactief' }
]

const statusFilter = ref('')

const zichtbareKlanten = computed(() => {
  if (statusFilter.value === 'actief') return klanten.filter((k) => k.actief)
  if (statusFilter.value === 'inactief') return klanten.filter((k) => !k.actief)
  return klanten
})
</script>

<style scoped>
.klanten-overzicht {
  max-width: 640px;
}
</style>
