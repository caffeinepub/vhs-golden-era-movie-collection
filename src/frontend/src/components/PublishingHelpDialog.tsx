import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export default function PublishingHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-background/50 border-2 border-retro-teal text-retro-teal hover:bg-retro-teal/20 retro-subheading text-sm px-4 py-2"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Помощь по публикации
        </Button>
      </DialogTrigger>
      <DialogContent className="retro-panel border-3 border-retro-magenta shadow-retro-lg max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="retro-grid absolute inset-0 pointer-events-none opacity-10" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl retro-heading text-retro-magenta retro-glow-magenta">
            РУКОВОДСТВО ПО ПУБЛИКАЦИИ
          </DialogTitle>
          <DialogDescription className="text-base retro-body text-foreground/90 mt-2">
            Как опубликовать ваше приложение в сети Internet Computer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 relative z-10 mt-6">
          <div className="space-y-4">
            <h3 className="text-2xl retro-heading text-retro-teal retro-glow-teal">
              ПУБЛИКАЦИЯ ИЗ ЧЕРНОВИКА В ПРОДАКШН
            </h3>
            <p className="text-base retro-body text-foreground/90">
              Когда вы создаёте приложение в Caffeine, оно начинается в режиме <strong>Черновик</strong>. Это означает, что только вы можете получить к нему доступ. Чтобы сделать его доступным для всех, вам нужно <strong>опубликовать</strong> его.
            </p>
            <ol className="space-y-3 text-base retro-body text-foreground/90 list-decimal list-inside ml-4">
              <li>Перейдите на страницу вашего проекта в Caffeine</li>
              <li>Найдите кнопку <strong>"Опубликовать"</strong> (обычно в правом верхнем углу)</li>
              <li>Нажмите её и подтвердите</li>
              <li>Подождите несколько секунд, пока приложение развёртывается</li>
              <li>Готово! Теперь ваше приложение доступно всем по публичному URL</li>
            </ol>
          </div>

          <div className="h-px bg-retro-teal/30" />

          <div className="space-y-4">
            <h3 className="text-2xl retro-heading text-retro-amber retro-glow-amber">
              УСТРАНЕНИЕ НЕПОЛАДОК
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl retro-heading text-retro-magenta mb-2">
                  "Бэкенд-канистер в данный момент остановлен"
                </h4>
                <p className="text-base retro-body text-foreground/90 mb-3">
                  Это сообщение означает, что ваш бэкенд на Internet Computer приостановлен на мгновение. Это может произойти, если сеть выполняет краткое обновление или перезапускает канистер.
                </p>
                <p className="text-base retro-body text-foreground/90">
                  <strong>Что делать:</strong>
                </p>
                <ul className="space-y-2 text-base retro-body text-foreground/90 list-disc list-inside ml-4 mt-2">
                  <li>Просто <strong>перезагрузите страницу</strong>, и она должна снова заработать</li>
                  <li>Если всё ещё показывается то же сообщение, подождите 10-20 секунд и обновите ещё раз</li>
                  <li>Ваше приложение развёрнуто и продолжит нормально работать после возобновления работы бэкенда</li>
                </ul>
              </div>

              <div className="h-px bg-retro-teal/20 my-4" />

              <div>
                <h4 className="text-xl retro-heading text-retro-magenta mb-2">
                  Всплывающее окно входа показывает "about:blank"
                </h4>
                <p className="text-base retro-body text-foreground/90 mb-3">
                  Если всплывающее окно Internet Identity показывает пустую страницу (about:blank) вместо экрана входа, это обычно проблема с кэшем браузера или блокировщиком всплывающих окон.
                </p>
                <p className="text-base retro-body text-foreground/90">
                  <strong>Решения:</strong>
                </p>
                <ul className="space-y-2 text-base retro-body text-foreground/90 list-disc list-inside ml-4 mt-2">
                  <li><strong>Разрешите всплывающие окна:</strong> Убедитесь, что ваш браузер не блокирует всплывающие окна для этого сайта</li>
                  <li><strong>Очистите кэш:</strong> Очистите кэш и куки браузера, затем попробуйте снова</li>
                  <li><strong>Попробуйте режим инкогнито:</strong> Откройте приложение в приватном/инкогнито окне</li>
                  <li><strong>Используйте другой браузер:</strong> Попробуйте Chrome, Firefox или Safari</li>
                  <li><strong>Жёсткое обновление:</strong> Нажмите Ctrl+Shift+R (Windows/Linux) или Cmd+Shift+R (Mac), чтобы принудительно обновить</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px bg-retro-teal/30" />

          <div className="space-y-4">
            <h3 className="text-2xl retro-heading text-retro-teal retro-glow-teal">
              ЛУЧШИЕ ПРАКТИКИ
            </h3>
            <ul className="space-y-2 text-base retro-body text-foreground/90 list-disc list-inside ml-4">
              <li>Всегда тестируйте ваше приложение в режиме Черновик перед публикацией</li>
              <li>После публикации подождите несколько секунд, чтобы изменения распространились</li>
              <li>Если вы видите старую версию, очистите кэш браузера</li>
              <li>Публичный URL не изменится после публикации</li>
              <li>Вы можете обновить опубликованное приложение в любое время, внеся изменения и снова опубликовав</li>
            </ul>
          </div>

          <div className="bg-retro-purple/10 border-2 border-retro-amber p-6 mt-6">
            <p className="text-base retro-body text-retro-amber">
              <strong className="retro-heading">НУЖНА ДОПОЛНИТЕЛЬНАЯ ПОМОЩЬ?</strong> Если у вас всё ещё возникают проблемы, обратитесь в службу поддержки Caffeine или посетите документацию для получения более подробных инструкций.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
