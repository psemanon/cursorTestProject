import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  color: white;

  h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const Features = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    text-align: center;
    margin-bottom: 3rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h3 {
    margin-bottom: 1rem;
    color: #3b82f6;
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Hero>
        <h1>欢迎来到我们的公司</h1>
        <p>为您提供最优质的服务和解决方案</p>
      </Hero>
      <Features>
        <h2>我们的优势</h2>
        <FeatureGrid>
          <FeatureCard>
            <h3>专业团队</h3>
            <p>拥有多年经验的专业团队，为您提供最优质的服务</p>
          </FeatureCard>
          <FeatureCard>
            <h3>创新科技</h3>
            <p>采用最新技术，持续创新，引领行业发展</p>
          </FeatureCard>
          <FeatureCard>
            <h3>优质服务</h3>
            <p>24小时专业服务支持，随时解决您的问题</p>
          </FeatureCard>
        </FeatureGrid>
      </Features>
    </HomeContainer>
  );
};

export default Home; 