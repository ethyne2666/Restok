import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Keyboard, Mic, ScanLine, Sparkles } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { VoicePanel } from '@/components/VoicePanel';
import { ScanPanel } from '@/components/ScanPanel';
import { TextPanel } from '@/components/TextPanel';
import { ConfirmUpdate } from '@/components/ConfirmUpdate';
import { parseCommand } from '@/utils/commandParser';
import { api } from '@/utils/api';
import { cn } from '@/utils/cn';

const MODES = [
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'text', label: 'Type', icon: Keyboard },
];

export default function AiAssistant() {
  const [params, setParams] = useSearchParams();
  const mode = MODES.find((m) => m.id === params.get('mode'))?.id ?? 'voice';
  const { data: medicines, error, isLoading, reload } = useFetch('/api/medicines');

  const [proposal, setProposal] = useState(null);
  const [reply, setReply] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  async function apply(p) {
    setIsBusy(true);
    try {
      const updated = await api.post(`/api/medicines/${p.medicine.id}/${p.intent}`, {
        quantity: p.quantity,
        source: p.source,
      });
      setProposal(null);
      reload();
      const message = `Done. ${updated.name} now has ${updated.quantity} left.`;
      setReply(message);
      return message;
    } catch (err) {
      setReply(err.message);
      return err.message;
    } finally {
      setIsBusy(false);
    }
  }

  async function handleInput(text, source) {
    const cmd = parseCommand(text, medicines);
    const say = (message, expectReply = false) => {
      setReply(message);
      return { reply: message, expectReply };
    };

    switch (cmd.intent) {
      case 'confirm':
        return proposal ? say(await apply(proposal)) : say('Nothing to confirm yet.');
      case 'cancel':
        setProposal(null);
        return say('Okay, cancelled.');
      case 'consume':
      case 'receive': {
        if (!cmd.medicine) return say('Which medicine? Try "took 2 Paracetamol".', true);
        const quantity = cmd.quantity ?? 1;
        setProposal({ intent: cmd.intent, medicine: cmd.medicine, quantity, source, heard: text });
        const verb = cmd.intent === 'consume' ? 'Log' : 'Receive';
        return say(`${verb} ${quantity} ${cmd.medicine.name}? Say yes to confirm or no to cancel.`, true);
      }
      case 'query_stock': {
        if (!cmd.medicine) return say('Which medicine do you mean?', true);
        const m = cmd.medicine;
        return say(`${m.name}: ${m.quantity} left, about ${m.daysLeft} days of stock.`);
      }
      case 'query_low': {
        const low = medicines.filter((m) => m.status !== 'OK');
        return say(
          low.length
            ? `Running low: ${low.map((m) => `${m.name} (${m.quantity})`).join(', ')}.`
            : 'Everything is well stocked.'
        );
      }
      default:
        return say('Sorry, I did not get that. Try "took 2 Paracetamol" or "how many Aspirin are left?"');
    }
  }

  function handleScanProposal(p) {
    setProposal(p);
    setReply(p.isDemo ? 'Demo result. Please review before confirming.' : 'Medicine recognised. Review and confirm.');
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Update</h1>
        <p className="text-sm text-slate-500">Update stock by voice, photo or text.</p>
      </div>

      <PageState isLoading={isLoading} error={error}>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-200/70 p-1">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setParams({ mode: id })}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition',
                mode === id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
              )}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {mode === 'voice' && <VoicePanel onInput={handleInput} />}
          {mode === 'scan' && <ScanPanel medicines={medicines ?? []} onProposal={handleScanProposal} />}
          {mode === 'text' && <TextPanel onInput={handleInput} />}
        </div>

        {reply && (
          <div className="flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-sm text-teal-900">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-teal-600" />
            <p>{reply}</p>
          </div>
        )}

        {proposal && (
          <ConfirmUpdate
            proposal={proposal}
            medicines={medicines}
            isBusy={isBusy}
            onChange={setProposal}
            onConfirm={() => apply(proposal)}
            onCancel={() => setProposal(null)}
          />
        )}
      </PageState>
    </div>
  );
}