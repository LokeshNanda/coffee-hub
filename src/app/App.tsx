import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './Shell';
import { ErrorBoundary } from './ErrorBoundary';
import { LearnHub } from '../features/learn/LearnHub';
import { BeansPage } from '../features/learn/BeansPage';
import { OriginsPage } from '../features/learn/OriginsPage';
import { ProcessingPage } from '../features/learn/ProcessingPage';
import { RoastingPage } from '../features/learn/RoastingPage';
import { GrindWaterPage } from '../features/learn/GrindWaterPage';
import { MethodsPage } from '../features/learn/MethodsPage';
import { MethodDetail } from '../features/learn/MethodDetail';
import { FlavourWheelPage } from '../features/learn/FlavourWheelPage';
import { SourcingPage } from '../features/learn/SourcingPage';
import { BrewHub } from '../features/brew/BrewHub';
import { CalculatorPage } from '../features/brew/CalculatorPage';
import { TimerPage } from '../features/brew/TimerPage';
import { LogList } from '../features/log/LogList';
import { BrewForm } from '../features/log/BrewForm';
import { BrewDetail } from '../features/log/BrewDetail';
import { BeansList } from '../features/log/BeansList';
import { BeanForm } from '../features/log/BeanForm';
import { BeanDetail } from '../features/log/BeanDetail';
import { SettingsPage } from '../features/settings/SettingsPage';

export function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<LearnHub />} />
            <Route path="learn" element={<Navigate to="/" replace />} />
            <Route path="learn/beans" element={<BeansPage />} />
            <Route path="learn/origins" element={<OriginsPage />} />
            <Route path="learn/processing" element={<ProcessingPage />} />
            <Route path="learn/roasting" element={<RoastingPage />} />
            <Route path="learn/grind-water" element={<GrindWaterPage />} />
            <Route path="learn/methods" element={<MethodsPage />} />
            <Route path="learn/methods/:id" element={<MethodDetail />} />
            <Route path="learn/flavours" element={<FlavourWheelPage />} />
            <Route path="learn/sourcing" element={<SourcingPage />} />
            <Route path="brew" element={<BrewHub />} />
            <Route path="brew/calculator" element={<CalculatorPage />} />
            <Route path="brew/timer/:id" element={<TimerPage />} />
            <Route path="log" element={<LogList />} />
            <Route path="log/new" element={<BrewForm />} />
            <Route path="log/:id" element={<BrewDetail />} />
            <Route path="log/:id/edit" element={<BrewForm />} />
            <Route path="beans" element={<BeansList />} />
            <Route path="beans/new" element={<BeanForm />} />
            <Route path="beans/:id" element={<BeanDetail />} />
            <Route path="beans/:id/edit" element={<BeanForm />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
