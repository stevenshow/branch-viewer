import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { teamNames } from '@/data/repoConfig';
import { getBubbleColor } from '@/utils/statusUtils';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DropDown({ selected, setSelected }) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative min-w-[10rem]">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-slate-500/50 py-1.5 pl-3 pr-10 text-left text-slate-100 shadow-sm ring-1 ring-inset ring-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span
                  className={`inline-block h-3 w-3 flex-shrink-0 rounded-full ${getBubbleColor(
                    selected,
                  )}`}
                />
                <span className="ml-3 block truncate">{selected}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-500 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {Object.keys(teamNames).map((team, id) => (
                  <Listbox.Option
                    key={id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-slate-600 text-white' : 'text-slate-100',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      )
                    }
                    value={team}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={`inline-block h-3 w-3 flex-shrink-0 rounded-full ${getBubbleColor(
                              team,
                            )}`}
                            aria-hidden="true"
                          />
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate',
                            )}
                          >
                            {team}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-slate-100',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
