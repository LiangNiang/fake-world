import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import ArrowOutlinedSVG from '@/assets/arrow-outlined.svg?react';
import BackFilledSVG from '@/assets/back-filled.svg?react';
import CoinFilledSVG from '@/assets/coin-filled.svg?react';
import { canBeDetected } from '@/components/NodeDetected';
import useModeNavigate from '@/components/useModeNavigate';
import { MetaDataType } from '@/state/detectedNode';
import { walletState } from '@/state/walletState';

const Balance = () => {
  const { balance } = useRecoilValue(walletState);
  const navigate = useModeNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-between px-4 py-2">
        <BackFilledSVG fill="black" className="h-5 w-5 cursor-pointer" onClick={() => navigate('/wechat/wallet')} />
        <div>{t('wechatPage.wallet.balancePage.transactions')}</div>
      </div>

      <canBeDetected.div
        className="relative flex flex-1 flex-col items-center pt-8"
        metaData={{ type: MetaDataType.Wallet, treeItemDisplayName: (data) => `我的零钱余额：¥${data.balance}` }}
      >
        <CoinFilledSVG className="h-16 w-16" fill="#FFC300" />
        <div className="mt-6">{t('wechatPage.wallet.balancePage.my')}</div>
        <div className="mt-4 flex">
          <span className="mr-1 text-3xl font-bold">¥</span>
          <span className="text-4xl font-bold">{balance}</span>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm text-wechatOrange-4">{t('wechatPage.wallet.balancePage.ad')}</span>
          <ArrowOutlinedSVG fill="#FBB162" className="h-4 w-4" />
        </div>
        <div className="absolute bottom-11">
          <div className="flex flex-col space-y-4">
            <div className="cursor-pointer rounded-lg bg-wechatBrand-2 px-18 py-2 text-center font-medium text-white">
              {t('wechatPage.wallet.balancePage.topUp')}
            </div>
            <div className="cursor-pointer rounded-lg bg-wechatBG-3 px-18 py-2 text-center font-medium text-black/70">
              {t('wechatPage.wallet.balancePage.withdraw')}
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center space-y-2">
            <div className="text-xs text-black/30">{t('wechatPage.wallet.balancePage.provided')}</div>
          </div>
        </div>
      </canBeDetected.div>
    </>
  );
};

export default Balance;
