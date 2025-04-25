<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { CalendarDate } from '@internationalized/date'
import type { AnyCalendarDate } from '@internationalized/date'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'

const props = defineProps<{
  onDateSelect?: (date: AnyCalendarDate) => void
}>()

const emit = defineEmits<{
  change: [date: AnyCalendarDate]
}>()

const today = new Date()
const todayDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
const selectedDate = ref(todayDate)
const isDateUnavailable = (date: CalendarDate) => {
  return date.compare(todayDate) < 0
}

const handleDateSelect = (date: AnyCalendarDate) => {
  props.onDateSelect?.(date)
  emit('change', date)
}

onMounted(() => {
  handleDateSelect(selectedDate.value)
})

watch(selectedDate, newDate => {
  handleDateSelect(newDate)
})
</script>

<template>
  <CalendarRoot
    v-slot="{ weekDays, grid }"
    v-model="selectedDate"
    :is-date-unavailable="isDateUnavailable"
    fixed-weeks
    class="mt-6 rounded-xl bg-white p-4 shadow-sm border"
  >
    <CalendarHeader class="flex items-center justify-between">
      <CalendarPrev
        class="inline-flex items-center cursor-pointer text-black justify-center rounded-md bg-transparent w-7 h-7 hover:bg-white/50 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
      >
        <Icon icon="radix-icons:chevron-left" class="w-4 h-4" />
      </CalendarPrev>
      <CalendarHeading class="text-sm text-black font-medium" />
      <CalendarNext
        class="inline-flex items-center cursor-pointer justify-center text-black rounded-md bg-transparent w-7 h-7 hover:bg-white/50 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
      >
        <Icon icon="radix-icons:chevron-right" class="w-4 h-4" />
      </CalendarNext>
    </CalendarHeader>

    <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="w-full border-collapse select-none space-y-1"
      >
        <CalendarGridHead>
          <CalendarGridRow class="mb-1 grid w-full grid-cols-7">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="rounded-md text-xs text-brand"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>

        <CalendarGridBody class="grid">
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="grid grid-cols-7"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="relative text-center text-sm"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                class="relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal text-black w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
