<template>
  <div class="subheader">
    <Container>
      <LandingTitle :landingTitle1="landingTitle1" :landingTitle2="landingTitle2" />
      <Costco :costcoContent="costcoContent" />
    </Container>
  </div>
  <div class="main">
    <TopFundHelp :topFundHelp="topFundHelp" />
    <TopFundApproach :topFundApproach="topFundApproach"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOADING } from '@/store/actions/application';

import Container from '@/components/ContainerComponent.vue';

import LandingTitle from './sections/LandingTitle.vue';
import Costco from './sections/Costco.vue';
import TopFundHelp from './sections/TopFundHelp.vue';
import TopFundApproach from './sections/TopFundApproach.vue';
// import {
//   LandingTitle,
//   Costco,
//   TopFUndHelp
// } from './sections'

export default defineComponent({
  name: 'topFundLanding',
  components: {
    Container,
    LandingTitle,
    Costco,
    TopFundHelp,
    TopFundApproach,
  },
  setup() {
    // Landing Title
    const landingTitle1 = 'TopFunds is an investment';
    const landingTitle2 = 'analytics and knowledge platform for long-term investors';
    // COSTCO
    const costcoContent = 'Costco Wholesale Corp';
    // TopFundHelp
    const topFundHelp = {
      title: 'topfunds helps to',
      subtitle: 'discover great businesses',
      content: [
        'Business ownership produces wealth over time-lots of it',
        'We focus on quality busnesses only. No IPOs, SPACS, hot issues, hype or one-year wokders',
      ],
      link: 'TF criteria and investable iniverse',
    };
    // TopFunds Approach
    const topFundApproach = {
      title: 'TopFunds Approach',
      content: 'Investors who think long-term, foucs on gerat businesses they understand and have their own judgement.',
      table: {
        header: [
          'TF is for',
          'As opposed to',
        ],
        body: [
          ['Participants', 'Investors', 'Speculators'],
          ['Time hrozon and attitue', 'Long-term, owner-like attitute', 'Short-term, buying chips to move around'],
          ['Investabale universe', 'Great and quality businesses', 'All listed companies'],
          ['Focus', 'Business fundamentals, understand the bunisess you own', 'Daily stock price moves'],
          ['Holding period', 'Forever (ideally) - as long as business performance is good', '1 day'],
          ['Attitude', 'Get few things right and try to do less', 'Know everything'],
          ['Community values', 'Independent thinking, rational discussion and challenged ideas', 'Non-detatable opinions and herding behaviour'],
        ],
      },
      link: {
        text: 'Learn more about approach',
        href: '#',
      },
    };
    const store = useStore();
    onMounted(() => {
      store.commit(LOADING, false);
    });
    return {
      landingTitle1,
      landingTitle2,
      costcoContent,
      topFundHelp,
      topFundApproach,
    };
  },
});
</script>

<style>
  .subheader {
    background-color: #EDEDED;
  }
  .main {
    background-color: #FFFFFF;
  }
</style>
