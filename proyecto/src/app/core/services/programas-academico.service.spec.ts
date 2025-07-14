import { TestBed } from '@angular/core/testing';

import { ProgramasAcademicoService } from './programas-academico.service';

describe('ProgramasAcademicoService', () => {
  let service: ProgramasAcademicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramasAcademicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
