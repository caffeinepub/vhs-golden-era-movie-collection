import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

export default function InstallHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-background/50 border-2 border-retro-amber text-retro-amber hover:bg-retro-amber/20 retro-subheading text-sm px-4 py-2"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Установить на телефон
        </Button>
      </DialogTrigger>
      <DialogContent className="retro-panel border-3 border-retro-magenta shadow-retro-lg max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl retro-heading text-retro-magenta retro-glow-magenta">
            УСТАНОВКА НА ТЕЛЕФОН
          </DialogTitle>
          <DialogDescription className="text-base retro-body text-foreground/90 mt-2">
            Установите это приложение на свой телефон для быстрого доступа
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 relative z-10 mt-6">
          <div className="space-y-4">
            <h3 className="text-2xl retro-heading text-retro-teal retro-glow-teal">
              ANDROID (CHROME)
            </h3>
            <ol className="space-y-3 text-base retro-body text-foreground/90 list-decimal list-inside">
              <li>Откройте это приложение в браузере Chrome</li>
              <li>Нажмите на меню (три точки) в правом верхнем углу</li>
              <li>Выберите "Установить приложение" или "Добавить на главный экран"</li>
              <li>Следуйте инструкциям на экране</li>
              <li>Приложение появится на вашем главном экране</li>
            </ol>
          </div>

          <div className="h-px bg-retro-teal/30" />

          <div className="space-y-4">
            <h3 className="text-2xl retro-heading text-retro-teal retro-glow-teal">
              IOS (SAFARI)
            </h3>
            <ol className="space-y-3 text-base retro-body text-foreground/90 list-decimal list-inside">
              <li>Откройте это приложение в браузере Safari</li>
              <li>Нажмите кнопку "Поделиться" (квадрат со стрелкой вверх) внизу экрана</li>
              <li>Прокрутите вниз и выберите "На экран «Домой»"</li>
              <li>Нажмите "Добавить" в правом верхнем углу</li>
              <li>Приложение появится на вашем главном экране</li>
            </ol>
          </div>

          <div className="bg-retro-purple/10 border-2 border-retro-amber p-6 mt-6">
            <p className="text-base retro-body text-retro-amber">
              <strong className="retro-heading">ПРИМЕЧАНИЕ:</strong> После установки приложение будет работать как обычное приложение на вашем телефоне, с собственной иконкой и без адресной строки браузера.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
