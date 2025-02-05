import { PrivacyHeader } from '@/components/common/PrivacyPolicy/PrivacyHeader'
import { PolicySection } from '@/components/common/PrivacyPolicy/PolicySection'
import { LegalInfo } from '@/components/common/PrivacyPolicy/LegalInfo'

export const PrivacyPage = () => {
  return (
    <div className="container">
      <PrivacyHeader />
      
      <PolicySection title="1. ОПРЕДЕЛЕНИЕ ТЕРМИНОВ">
        <p>1.1. В настоящей Политике конфиденциальности используются следующие термины:</p>
        <p>1.1.1. «Администрация сайта Агентства недвижимости...</p>
        {/* остальной текст раздела 1 */}
      </PolicySection>

      <PolicySection title="2. ОБЩИЕ ПОЛОЖЕНИЯ">
        <p>2.1. Использование Пользователем сайта Агентства недвижимости...</p>
        {/* остальной текст раздела 2 */}
      </PolicySection>

      {/* Аналогично для остальных разделов */}

      <LegalInfo />
    </div>
  );
};
